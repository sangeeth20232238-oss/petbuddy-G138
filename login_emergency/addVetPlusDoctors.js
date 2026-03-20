const https = require('https');

const API_KEY = 'AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM';
const PROJECT_ID = 'petbuddy-138';
const CLINIC_ID = '1hWREhjbDUC4sAL4YDUg';

const doctors = [
    { name: 'Dr. Priya Mendis', specialization: 'Small Animal Surgery', experience: '8 years', chargeMin: 1500, chargeMax: 3000, hoursPerDay: 8, bio: 'Dr. Priya specializes in small animal surgery with over 8 years of experience treating cats and dogs.', imageUrl: 'https://i.pravatar.cc/150?u=priya' },
    { name: 'Dr. Kamal Silva', specialization: 'Emergency & Critical Care', experience: '6 years', chargeMin: 2000, chargeMax: 4000, hoursPerDay: 10, bio: 'Dr. Kamal is an emergency care specialist known for his calm approach in critical situations.', imageUrl: 'https://i.pravatar.cc/150?u=kamal' },
    { name: 'Dr. Nisha Fernando', specialization: 'Dermatology & Allergy', experience: '5 years', chargeMin: 1200, chargeMax: 2500, hoursPerDay: 7, bio: 'Dr. Nisha focuses on skin conditions and allergies in pets, helping them live itch-free lives.', imageUrl: 'https://i.pravatar.cc/150?u=nisha' },
    { name: 'Dr. Rohan Perera', specialization: 'Orthopedics', experience: '10 years', chargeMin: 2500, chargeMax: 5000, hoursPerDay: 8, bio: 'Dr. Rohan is a senior orthopedic vet with a decade of experience in bone and joint treatments.', imageUrl: 'https://i.pravatar.cc/150?u=rohan' },
    { name: 'Dr. Amara Jayasinghe', specialization: 'General Practice', experience: '4 years', chargeMin: 800, chargeMax: 1500, hoursPerDay: 9, bio: 'Dr. Amara handles general wellness checkups, vaccinations, and routine care for all pets.', imageUrl: 'https://i.pravatar.cc/150?u=amara' },
];

function toDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') fields[k] = { stringValue: v };
        else if (typeof v === 'number') fields[k] = { doubleValue: v };
    }
    return { fields };
}

function post(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: 'firestore.googleapis.com',
            path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents${path}?key=${API_KEY}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
        };
        const req = https.request(options, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => {
                const p = JSON.parse(b);
                if (p.error) reject(new Error(p.error.message));
                else resolve(p);
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log('Adding doctors to VetPlus Clinic...\n');
    for (const doc of doctors) {
        try {
            const res = await post(`/clinics/${CLINIC_ID}/doctors`, toDoc(doc));
            console.log(`✅ Added: ${doc.name} (${res.name.split('/').pop()})`);
        } catch (e) {
            console.error(`❌ Failed: ${doc.name} — ${e.message}`);
        }
    }
    console.log('\nDone!');
    process.exit(0);
}

run();
