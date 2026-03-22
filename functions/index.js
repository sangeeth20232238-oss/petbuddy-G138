const functions = require("firebase-functions");
const fs = require("fs");
const path = require("path");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const { parse } = require("csv-parse/sync");
const Fuse = require("fuse.js");
const natural = require("natural");
const stemmer = natural.PorterStemmer;

/**
 * ----------------------------
 * 1) Load CSV once (cold start)
 * ----------------------------
 * Put your CSV here:
 * functions/data/dog_first_aid.csv
 */
const DATA_PATH = path.join(__dirname, "data", "dog_first_aid.csv");
let cachedData = null;
function loadAdviceRows() {
  if (cachedData) return cachedData;
  const csvText = fs.readFileSync(DATA_PATH, "utf8");
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  // Normalize fields
   cachedData = rows
    .map((r) => ({
      animalname: String(r.animalname || "").trim().toLowerCase(),
      symptom: String(r.symptom || "").trim().toLowerCase(),
      first_aid_advice: String(r.first_aid_advice || "").trim(),
      emergency: String(r.emergency || "").trim().toLowerCase(), // "yes" or "no"
    }))
    .filter((r) => r.symptom);

    return cachedData;
}

let symptomMap = null;

function getSymptomMap() {
  if (symptomMap) return symptomMap;

  const data = loadAdviceRows(); // 🔥 load safely
  symptomMap = new Map();

  for (const r of data) {
    if (!symptomMap.has(r.symptom)) {
      symptomMap.set(r.symptom, r);
    }
  }

  return symptomMap;
}



/**
 * ----------------------------------------
 * Normalize user symptom (alias -> clean)
 * ----------------------------------------
 */
function normalizeSymptom(userInput) {
  const text = String(userInput || "").toLowerCase().trim();
  if (SYMPTOM_ALIASES[text]) return SYMPTOM_ALIASES[text];
  return text;
}

/**
 * ----------------------------------------
 * 2) “Common name” / unnormalized mappings
 * ----------------------------------------
 */
const SYMPTOM_ALIASES = {
  // vomiting
  "vomitting": "vomiting",
  "vomit": "vomiting",
  "throwing up": "vomiting",
  "dog vomiting": "vomiting",
  "dog vomit": "vomiting",

  // diarrhea
  "diarhea": "diarrhea",
  "diarrhoea": "diarrhea",
  "loosemotion": "diarrhea",
  "loose_motions": "diarrhea",
  "loose stool": "diarrhea",
  "watery stool": "diarrhea",
  "runny stool": "diarrhea",

  // appetite
  "poor appetite": "loss of appetite",
  "no appetite": "loss of appetite",
  "not eating": "loss of appetite",
  "dog not eating": "loss of appetite",
  "loss appetite": "loss of appetite",
  "unable to eat": "loss of appetite",
  "eating":"loss of appetite",
  "Eating":"loss of appetite",

  // fever
  "high temperature": "fever",
  "dog fever": "fever",
  "hot body": "fever",
  "high temp": "fever",

  // lethargy
  "tired": "lethargy",
  "very tired": "lethargy",
  "low energy": "lethargy",
  "weak": "lethargy",
  "reduced energy": "lethargy",

  // breathing 
  "breathing problem": "breathing difficulty",
  "hard to breathe": "breathing difficulty",
  "trouble breathing": "breathing difficulty",
  "labored breathing": "breathing difficulty",

  // nose
  "runny nose": "nasal discharge",
  "nose discharge": "nasal discharge",
  "fluid from nose": "nasal discharge",

  // walking
  "limping": "lameness",
  "cannot walk properly": "lameness",
  "difficulty walking": "lameness",
  "leg injury": "lameness",

  // seizures
  "fits": "seizures",
  "convulsions": "seizures",
  "dog shaking": "seizures",
  "body shaking": "seizures",

  // weight loss
  "losing weight": "weight loss",
  "getting thin": "weight loss",
  "dog losing weight": "weight loss",

    // bones
  "bone broke": "broken bones",
  "broke bone": "broken bones",
  "broken bone": "broken bones",
  "bone fracture": "broken bones",
  "fractured bone": "broken bones",
};


/**
 * ----------------------------------------
 * 3) Extract symptoms from full sentences
 * ----------------------------------------
 */
function getCleanSymptoms() {
  return Array.from(getSymptomMap().keys());
}
const CLEAN_SET = new Set(getCleanSymptoms());

function getMatchPhrases() {
  return [
    ...Object.keys(SYMPTOM_ALIASES),
    ...getCleanSymptoms()
  ]
    .map((s) => s.toLowerCase().trim())
    .sort((a, b) => b.length - a.length);
}

function cleanText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[_\-]/g, " ")         // loose_motions -> loose motions
    .replace(/[^\w\s]/g, " ")       // remove punctuation
    .replace(/\s+/g, " ")           // collapse spaces
    .trim();
}

/**
 * ----------------------------------------
 * 3) Extract symptoms from full sentences
 * ----------------------------------------
 */
function extractSymptomsFromMessage(userMessage) {
  const text = ` ${cleanText(userMessage)} `;
  const found = new Set();

  const words = text.split(" ");

  for (const phrase of getMatchPhrases()) {
  const p = ` ${phrase} `;

  if (text.includes(p)) {
    const normalized = normalizeSymptom(phrase);
    if (CLEAN_SET.has(normalized)) found.add(normalized);
  } 
}

  return Array.from(found);
}


/**
 * ----------------------------
 * 4) Fuzzy matcher (backup)
 * ----------------------------
 */
function getAllSymptoms() {
  return Array.from(getSymptomMap().keys());
}


let fuse = null;

function getFuse() {
  if (fuse) return fuse;

  const symptoms = Array.from(getSymptomMap().keys()).map(s => normalizeText(s));

  fuse = new Fuse(symptoms, {
    includeScore: true,
    threshold: 0.25,
  });

  return fuse;
}

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(" ")
    .map(word => stemmer.stem(word))   //  MAGIC LINE
    .join(" ")
    .trim();
}
/**
 * ------------------------------------------------
 * Fallback when sentence-extraction finds nothing.
 * ------------------------------------------------
 */
function findBestSymptoms(userMessage) {
  const msg = normalizeText(userMessage);

  if (msg.length < 3) return []; //  Block short useless inputs like "hi", "ok"

  // 1) alias phrase appears in message
  const aliasHits = [];
  for (const [alias, canonical] of Object.entries(SYMPTOM_ALIASES)) {
    const a = normalizeText(alias);
    if (msg === a || msg.includes(a)) aliasHits.push(canonical);
  }

  //  exact word match 
  for (const key of getSymptomMap().keys()) {
    if (msg === normalizeText(key)) {
      return [key];
    }
  }

  // 2) fuzzy match whole message
 const fuzzy = getFuse().search(msg).filter(r => r.score < 0.35).slice(0, 3).map((r) => r.item);

  // unique + keep valid
  const combined = [...aliasHits, ...fuzzy].map((s) => normalizeText(s));
  const unique = [];
  for (const s of combined) if (s && !unique.includes(s)) unique.push(s);

  const map = getSymptomMap();

  return unique
    .map(s => {
      // find original symptom from map
      for (const key of map.keys()) {
        if (normalizeText(key) === s) return key;
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * --------------------------------
 * 5) Build advice reply (MULTI)
 * --------------------------------
 */
function buildAdviceReply(symptoms) {
  let anyEmergency = false;
  const parts = [];

  for (const s of symptoms) {
    const map = getSymptomMap();
    const row = map.get(s);
    if (!row) continue;

    const isEmergency = row.emergency === "yes";
    if (isEmergency) anyEmergency = true;

    parts.push(
      `✅ Matched symptom: ${s}\n` +
      `${isEmergency ? "🚨 Emergency: YES\n" : "🟢 Emergency: NO\n"}` +
      `🩺 First aid:\n${row.first_aid_advice}`
    );
  }

  const header = symptoms.length ? "" : "👋 Hi! I'm your pet care assistant 🐶\n\n";
  const emergencyMsg  = anyEmergency
    ? "🚨 EMERGENCY WARNING: If symptoms are severe/worsening, contact a vet immediately.\n\n"
    : "";

  const followUp = `
👉 Is your dog showing any other symptoms?

💡 You can type things like:
- vomiting
- fever
- not eating
- breathing difficulty or any other symptoms 

🐾 I'm here to help. Stay safe!
`;  

  return header + parts.join("\n\n---------\n\n")+ emergencyMsg + followUp;
};



/**
 * --------------------------------
 * Save unknown symptoms for review
 * --------------------------------
 */
async function saveUnknownSymptom(userMessage) {
  try {
    await db.collection("unknown_symptoms").add({
      message: userMessage,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error saving unknown symptom:", error);
  }
}
/**
 * --------------------------------
 * 6) HTTP Chatbot Endpoint
 * --------------------------------
 * POST JSON: { "message": "my dog is vomitting and not eating" }
 */

exports.chatbot = functions.https.onRequest((req, res) => {

  // Enable CORS for all incoming requests
  cors(req, res, async () => {

    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");       // allow all origins
      res.set("Access-Control-Allow-Methods", "POST");   // allow POST requests
      res.set("Access-Control-Allow-Headers", "Content-Type"); // allow headers
      return res.status(204).send(""); // no content response
    }

    try {
     
      const message = req.body?.message;

      // Normalize message
      const msg = String(message || "").toLowerCase().trim();

      // Handle greetings
      const greetings = ["hi", "Hi","Hello","hello","hlo", "Hy","hy","hey", "yo","Good mornging","Good evening","good mornging","good evening"];

      if (greetings.includes(msg)) {
        return res.json({
          found: false,
          reply: "Hi 👋 Tell me your dog's symptoms and I’ll help you."
        });
      }

      //handle goodbyes
      const goodbyes = ["bye", "thanks", "thank you", "ok thanks", "bye bye","thnx"];

      if (goodbyes.includes(msg)) {
        return res.json({
          found: false,
          reply: "👋 Take care! If your pet needs help again, I’m here 🐾"
        });
      }


      // Block short messages
      if (!msg || msg.length < 3 ) {
        return res.json({
          found: false,
          reply: "Please describe your dog's symptoms 🐶"
        });
      }

     
      if (!message) {
        return res.status(400).json({
          error: "No message provided"
        });
      }
      let symptoms = extractSymptomsFromMessage(message);
      
      //fallback using Fuse
      if (symptoms.length === 0) {
        symptoms = findBestSymptoms(message);
      }

      //ONLY KEEP ONE (what user asked)
      if (symptoms.length > 0) {
        symptoms = [symptoms[0]];
      }

      // still nothing → then fail
      if (symptoms.length === 0) {
        await saveUnknownSymptom(message);

      return res.json({
        found: false,
        reply:
          "I couldn’t match the symptom clearly. Please contact a vet immediately if symptoms are serious.",
      });
    }

    const reply = buildAdviceReply(symptoms);

    return res.json({
      found: true,
      matched_symptoms: symptoms,
      reply,
    });

    } catch (err) {
      console.error("Server Error:", err);

      return res.status(500).json({
        error: "Server error"
      });
    }

    console.log("User message:", message);
    console.log("Extracted symptoms:", symptoms);

  });
  // 🔥 force deploy
});

//Suggestions API (for frontend popup)
exports.suggestions = functions.https.onRequest((req, res) => {
  // Enable CORS so frontend (React Native / web) can access this API
  cors(req, res, () => {
    // Get user input from query parameter (?q=...)
    const query = req.query.q || "";
    const normalized = normalizeText(query); // Normalize input (lowercase, remove special chars)

    /**
     * Filter symptoms based on user input
     * - Checks if symptom includes the typed text
     * - Example: "bone" → "broken bones"
     */

    const matches = getAllSymptoms().filter(symptom =>
      symptom.includes(normalized) || normalized.includes(symptom)
    )
    .slice(0, 5); // Limit to top 5 suggestions

    /**
     * Send suggestions back to frontend
     */
    res.json({
      suggestions: matches,
    });
  });
});




