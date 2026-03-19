const { db } = require('./firebaseAdmin');

async function debugData() {
    const snapshot = await db.collection('pets').get();
    let hasError = false;
    snapshot.docs.forEach(doc => {
        const p = doc.data();
        if (!p.name || typeof p.name !== 'string') { console.log(`Doc ${doc.id} missing/bad name`); hasError = true; }
        if (!p.type || typeof p.type !== 'string') { console.log(`Doc ${doc.id} missing/bad type`); hasError = true; }
        if (!p.breed || typeof p.breed !== 'string') { console.log(`Doc ${doc.id} missing/bad breed`); hasError = true; }
        if (!p.image || typeof p.image !== 'string') { console.log(`Doc ${doc.id} missing/bad image`); hasError = true; }
        if (!p.age || typeof p.age !== 'string') { console.log(`Doc ${doc.id} missing/bad age`); hasError = true; }
        if (!p.gender || typeof p.gender !== 'string') { console.log(`Doc ${doc.id} missing/bad gender`); hasError = true; }
        console.log(`Pet: ${p.name}, Type: ${p.type}, Breed: ${p.breed}, Image startsWith: ${p.image ? p.image.substring(0, 5) : 'none'}`);
    });
    if (!hasError) console.log("All pets perfectly formatted.");
}
debugData();
