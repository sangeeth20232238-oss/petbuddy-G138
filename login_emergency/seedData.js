// seedData.js - Run once: node seedData.js
const https = require('https');

const PROJECT_ID = 'petbuddy-138';
const API_KEY = 'AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM';

const clinicsWithDoctors = [
    {
        clinic: {
            name: "VetPlus Clinic",
            address: "12 Duplication Road, Colombo 04",
            distance: "2.5 km",
            status: "Open Now",
            phone: "+94112987654",
            hours: "Mon–Sun: 7:00 AM – 10:00 PM",
            img: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400",
            imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400",
            rating: 4.6,
        },
        doctors: [
            { name: "Dr. Priya Mendis", specialization: "Small Animal Surgery", experience: "8 years", chargeMin: 1500, chargeMax: 3000, hoursPerDay: 8, bio: "Dr. Priya specializes in small animal surgery with over 8 years of experience treating cats and dogs.", imageUrl: "https://i.pravatar.cc/150?u=priya" },
            { name: "Dr. Kamal Silva", specialization: "Emergency & Critical Care", experience: "6 years", chargeMin: 2000, chargeMax: 4000, hoursPerDay: 10, bio: "Dr. Kamal is an emergency care specialist known for his calm approach in critical situations.", imageUrl: "https://i.pravatar.cc/150?u=kamal" },
            { name: "Dr. Nisha Fernando", specialization: "Dermatology & Allergy", experience: "5 years", chargeMin: 1200, chargeMax: 2500, hoursPerDay: 7, bio: "Dr. Nisha focuses on skin conditions and allergies in pets, helping them live itch-free lives.", imageUrl: "https://i.pravatar.cc/150?u=nisha" },
            { name: "Dr. Rohan Perera", specialization: "Orthopedics", experience: "10 years", chargeMin: 2500, chargeMax: 5000, hoursPerDay: 8, bio: "Dr. Rohan is a senior orthopedic vet with a decade of experience in bone and joint treatments.", imageUrl: "https://i.pravatar.cc/150?u=rohan" },
            { name: "Dr. Amara Jayasinghe", specialization: "General Practice", experience: "4 years", chargeMin: 800, chargeMax: 1500, hoursPerDay: 9, bio: "Dr. Amara handles general wellness checkups, vaccinations, and routine care for all pets.", imageUrl: "https://i.pravatar.cc/150?u=amara" },
        ]
    },
    {
        clinic: {
            name: "Happy Paws Veterinary",
            address: "78 Nawala Road, Nugegoda",
            distance: "4.1 km",
            status: "Open Now",
            phone: "+94112556677",
            hours: "Mon–Fri: 9:00 AM – 6:00 PM, Sat: 9:00 AM – 2:00 PM",
            img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
            rating: 4.5,
        },
        doctors: [
            { name: "Dr. Shalini Wijeratne", specialization: "Feline Specialist", experience: "7 years", chargeMin: 1000, chargeMax: 2000, hoursPerDay: 8, bio: "Dr. Shalini is passionate about feline health and has treated thousands of cats across Sri Lanka.", imageUrl: "https://i.pravatar.cc/150?u=shalini" },
            { name: "Dr. Dinesh Cooray", specialization: "Neurology", experience: "9 years", chargeMin: 3000, chargeMax: 6000, hoursPerDay: 7, bio: "Dr. Dinesh is one of the few veterinary neurologists in Sri Lanka, specializing in brain and nerve disorders.", imageUrl: "https://i.pravatar.cc/150?u=dinesh" },
            { name: "Dr. Tharushi Bandara", specialization: "Nutrition & Internal Medicine", experience: "5 years", chargeMin: 1200, chargeMax: 2200, hoursPerDay: 8, bio: "Dr. Tharushi helps pets with digestive issues and designs custom nutrition plans.", imageUrl: "https://i.pravatar.cc/150?u=tharushi" },
            { name: "Dr. Asanka Ranasinghe", specialization: "Ophthalmology", experience: "6 years", chargeMin: 1800, chargeMax: 3500, hoursPerDay: 6, bio: "Dr. Asanka specializes in eye conditions and vision care for dogs and cats.", imageUrl: "https://i.pravatar.cc/150?u=asanka" },
            { name: "Dr. Malini Gunawardena", specialization: "Reproductive Health", experience: "8 years", chargeMin: 1500, chargeMax: 3000, hoursPerDay: 8, bio: "Dr. Malini handles breeding consultations, pregnancy care, and neonatal health.", imageUrl: "https://i.pravatar.cc/150?u=malini" },
        ]
    },
    {
        clinic: {
            name: "City Vet Emergency Centre",
            address: "33 Union Place, Colombo 02",
            distance: "3.0 km",
            status: "Open 24/7",
            phone: "+94112111222",
            hours: "Open 24 Hours, 7 Days",
            img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
            imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
            rating: 4.9,
        },
        doctors: [
            { name: "Dr. Chamara Dissanayake", specialization: "Emergency Medicine", experience: "12 years", chargeMin: 2500, chargeMax: 5000, hoursPerDay: 12, bio: "Dr. Chamara leads the emergency unit and has handled thousands of critical cases over 12 years.", imageUrl: "https://i.pravatar.cc/150?u=chamara" },
            { name: "Dr. Iresha Senanayake", specialization: "Intensive Care & Anesthesia", experience: "8 years", chargeMin: 3000, chargeMax: 6000, hoursPerDay: 10, bio: "Dr. Iresha manages ICU patients and oversees anesthesia for all surgical procedures.", imageUrl: "https://i.pravatar.cc/150?u=iresha" },
            { name: "Dr. Nuwan Wickramasinghe", specialization: "Trauma & Surgery", experience: "10 years", chargeMin: 3500, chargeMax: 7000, hoursPerDay: 10, bio: "Dr. Nuwan is a trauma surgeon who handles accident cases and complex surgeries.", imageUrl: "https://i.pravatar.cc/150?u=nuwan" },
            { name: "Dr. Sachini Liyanage", specialization: "Cardiology", experience: "7 years", chargeMin: 2000, chargeMax: 4000, hoursPerDay: 8, bio: "Dr. Sachini specializes in heart conditions and performs ECGs and echocardiograms for pets.", imageUrl: "https://i.pravatar.cc/150?u=sachini" },
            { name: "Dr. Prasad Herath", specialization: "Toxicology & Poison Control", experience: "6 years", chargeMin: 2000, chargeMax: 4500, hoursPerDay: 9, bio: "Dr. Prasad handles poisoning and toxic ingestion emergencies, available around the clock.", imageUrl: "https://i.pravatar.cc/150?u=prasad" },
        ]
    },
    {
        clinic: {
            name: "Green Leaf Animal Clinic",
            address: "19 High Level Road, Maharagama",
            distance: "6.3 km",
            status: "Open Now",
            phone: "+94112334455",
            hours: "Mon–Sat: 8:30 AM – 7:00 PM",
            img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
            imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
            rating: 4.4,
        },
        doctors: [
            { name: "Dr. Kavindi Rajapaksa", specialization: "General Practice", experience: "5 years", chargeMin: 800, chargeMax: 1500, hoursPerDay: 8, bio: "Dr. Kavindi provides compassionate general care including vaccinations and wellness exams.", imageUrl: "https://i.pravatar.cc/150?u=kavindi" },
            { name: "Dr. Thilina Samaraweera", specialization: "Dentistry", experience: "6 years", chargeMin: 1500, chargeMax: 3000, hoursPerDay: 7, bio: "Dr. Thilina is a veterinary dentist who performs cleanings, extractions, and oral surgeries.", imageUrl: "https://i.pravatar.cc/150?u=thilina" },
            { name: "Dr. Nadeesha Kumari", specialization: "Exotic Animals", experience: "4 years", chargeMin: 1200, chargeMax: 2500, hoursPerDay: 8, bio: "Dr. Nadeesha treats exotic pets including rabbits, birds, reptiles, and small mammals.", imageUrl: "https://i.pravatar.cc/150?u=nadeesha" },
            { name: "Dr. Buddhika Jayawardena", specialization: "Radiology & Imaging", experience: "7 years", chargeMin: 2000, chargeMax: 4000, hoursPerDay: 8, bio: "Dr. Buddhika handles X-rays, ultrasounds, and MRI interpretations for accurate diagnosis.", imageUrl: "https://i.pravatar.cc/150?u=buddhika" },
            { name: "Dr. Sanduni Peris", specialization: "Preventive Medicine", experience: "3 years", chargeMin: 700, chargeMax: 1200, hoursPerDay: 9, bio: "Dr. Sanduni focuses on preventive care, parasite control, and health screening programs.", imageUrl: "https://i.pravatar.cc/150?u=sanduni" },
        ]
    },
];

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
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const parsed = JSON.parse(body);
                if (parsed.error) reject(new Error(parsed.error.message));
                else resolve(parsed);
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function toFirestoreDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') fields[k] = { stringValue: v };
        else if (typeof v === 'number') fields[k] = { doubleValue: v };
        else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    }
    return { fields };
}

async function seed() {
    console.log('🌱 Seeding Firestore...\n');
    for (const entry of clinicsWithDoctors) {
        try {
            const clinicRes = await post('/clinics', toFirestoreDoc(entry.clinic));
            const clinicId = clinicRes.name.split('/').pop();
            console.log(`✅ Clinic added: ${entry.clinic.name} (${clinicId})`);

            for (const doctor of entry.doctors) {
                await post(`/clinics/${clinicId}/doctors`, toFirestoreDoc(doctor));
                console.log(`   👨‍⚕️ Doctor added: ${doctor.name}`);
            }
            console.log('');
        } catch (e) {
            console.error(`❌ Failed for ${entry.clinic.name}: ${e.message}`);
        }
    }
    console.log('✅ Done! All clinics and doctors seeded.');
}

seed();
