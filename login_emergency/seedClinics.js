// seedClinics.js
// Run this ONCE from your project root:
//   node seedClinics.js
//
// It will add 5 clinics to your Firestore 'clinics' collection.

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM",
    authDomain: "petbuddy-138.firebaseapp.com",
    projectId: "petbuddy-138",
    storageBucket: "petbuddy-138.firebasestorage.app",
    messagingSenderId: "506859726227",
    appId: "1:506859726227:web:9083b07cceca26b8b6b466",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const clinics = [
    {
        name: "PawCare Animal Hospital",
        address: "45 Galle Road, Colombo 03",
        distance: "1.2 km",
        status: "Open Now",
        phone: "+94112345678",
        hours: "Mon–Sat: 8:00 AM – 8:00 PM",
        imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400",
        rating: 4.8,
        specialties: ["Emergency Care", "Surgery", "Vaccination"],
    },
    {
        name: "VetPlus Clinic",
        address: "12 Duplication Road, Colombo 04",
        distance: "2.5 km",
        status: "Open Now",
        phone: "+94112987654",
        hours: "Mon–Sun: 7:00 AM – 10:00 PM",
        imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400",
        rating: 4.6,
        specialties: ["24/7 Emergency", "Dental", "X-Ray"],
    },
    {
        name: "Happy Paws Veterinary",
        address: "78 Nawala Road, Nugegoda",
        distance: "4.1 km",
        status: "Open Now",
        phone: "+94112556677",
        hours: "Mon–Fri: 9:00 AM – 6:00 PM, Sat: 9:00 AM – 2:00 PM",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
        rating: 4.5,
        specialties: ["General Care", "Grooming", "Nutrition"],
    },
    {
        name: "City Vet Emergency Centre",
        address: "33 Union Place, Colombo 02",
        distance: "3.0 km",
        status: "Open 24/7",
        phone: "+94112111222",
        hours: "Open 24 Hours, 7 Days",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
        rating: 4.9,
        specialties: ["24/7 Emergency", "ICU", "Surgery", "Blood Bank"],
    },
    {
        name: "Green Leaf Animal Clinic",
        address: "19 High Level Road, Maharagama",
        distance: "6.3 km",
        status: "Open Now",
        phone: "+94112334455",
        hours: "Mon–Sat: 8:30 AM – 7:00 PM",
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
        rating: 4.4,
        specialties: ["General Care", "Vaccination", "Lab Tests"],
    },
];

async function seed() {
    console.log('Seeding clinics...');
    for (const clinic of clinics) {
        const ref = await addDoc(collection(db, 'clinics'), clinic);
        console.log(`✅ Added: ${clinic.name} (${ref.id})`);
    }
    console.log('\nDone! All 5 clinics added to Firestore.');
    process.exit(0);
}

seed().catch(e => {
    console.error('Error seeding:', e);
    process.exit(1);
});
