const functions = require("firebase-functions");
const fs = require("fs");
const path = require("path");
const cors = require("cors")({ origin: true });

const { parse } = require("csv-parse/sync");
const Fuse = require("fuse.js");

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
 * Normalize user symptom (alias -> clean)
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
const CLEAN_SYMPTOMS = Array.from(SYMPTOM_TO_ROW.keys()); // Always matches CSV
const CLEAN_SET = new Set(CLEAN_SYMPTOMS);

const MATCH_PHRASES = [
  ...Object.keys(SYMPTOM_ALIASES),
  ...CLEAN_SYMPTOMS
]
  .map((s) => s.toLowerCase().trim())
  .sort((a, b) => b.length - a.length); // longest first

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

  for (const phrase of MATCH_PHRASES) {
    const p = ` ${phrase} `;

    if (text.includes(p)) { //exact phrase match
      const normalized = normalizeSymptom(phrase);
      if (CLEAN_SET.has(normalized)) found.add(normalized);
    }
     
    // partial word match (e.g. "vomiting" matches "vomit")
    else if (words.some(word => word.length > 3 && phrase.includes(word))) {
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
const ALL_SYMPTOMS = Array.from(SYMPTOM_TO_ROW.keys());

const fuse = new Fuse(ALL_SYMPTOMS, {
  includeScore: true,
  threshold: 0.35,
});

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fallback when sentence-extraction finds nothing.
 */
function findBestSymptoms(userMessage) {
  const msg = normalizeText(userMessage);

  // 1) alias phrase appears in message
  const aliasHits = [];
  for (const [alias, canonical] of Object.entries(SYMPTOM_ALIASES)) {
    const a = normalizeText(alias);
    if (msg === a || msg.includes(a)) aliasHits.push(canonical);
  }

  // 2) fuzzy match whole message
  const fuzzy = fuse.search(msg).slice(0, 5).map((r) => r.item);

  // unique + keep valid
  const combined = [...aliasHits, ...fuzzy].map((s) => normalizeText(s));
  const unique = [];
  for (const s of combined) if (s && !unique.includes(s)) unique.push(s);

  return unique.filter((s) => SYMPTOM_TO_ROW.has(s));
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
    const row = SYMPTOM_TO_ROW.get(s);
    if (!row) continue;

    const isEmergency = row.emergency === "yes";
    if (isEmergency) anyEmergency = true;

    parts.push(
      `✅ Matched symptom: ${s}\n` +
      `${isEmergency ? "🚨 Emergency: YES\n" : "🟢 Emergency: NO\n"}` +
      `🩺 First aid:\n${row.first_aid_advice}`
    );
  }

  const header = anyEmergency
    ? "🚨 EMERGENCY WARNING: If symptoms are severe/worsening, contact a vet immediately.\n\n"
    : "";

  return header + parts.join("\n\n--------------------\n\n");
}


/**
 * --------------------------------
 * Save unknown symptoms for review
 * --------------------------------
 */
function saveUnknownSymptom(userMessage) {
  const fs = require("fs");
  const path = require("path");

  const logPath = path.join(__dirname, "unknown_symptoms.txt");
  const time = new Date().toISOString();

  fs.appendFileSync(logPath, `${time} | ${userMessage}\n`);
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
        saveUnknownSymptom(message);

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

    const matches = ALL_SYMPTOMS.filter(symptom =>
      symptom.includes(normalized) || normalized.includes(symptom)
    )
    .slice(0, 5); // Limit to top 5 suggestions

    /**
     * Send suggestions back to frontend
     */
    res.json({
      suggestions: matches,
    });

    exports.chatbot = functions.https.onRequest((req, res) => {
      const data = loadAdviceRows();     //  safe
      const map = getSymptomMap();       //  safe

      const userInput = req.body.message.toLowerCase();

      const result = map.get(userInput);

      if (result) {
        return res.json({
          reply: result.first_aid_advice,
        });
      }

      return res.json({
        reply: "No advice found for this symptom.",
      });
    });

  });
});



