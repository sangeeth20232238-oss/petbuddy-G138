const { db } = require('./firebaseAdmin');

async function fix() {
    const snapshot = await db.collection('pets').get();
    let count = 0;
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        let needsUpdate = false;
        let updateData = {};
        
        if (data.type && data.type !== data.type.toLowerCase()) {
            updateData.type = data.type.toLowerCase();
            needsUpdate = true;
        }
        if (data.gender && data.gender !== data.gender.toLowerCase()) {
            updateData.gender = data.gender.toLowerCase();
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            batch.update(doc.ref, updateData);
            count++;
            console.log(`Fixing pet ${data.name}: ${JSON.stringify(updateData)}`);
        }
    });

    if (count > 0) {
        await batch.commit();
        console.log(`Successfully fixed ${count} pets in the database.`);
    } else {
        console.log("No pets needed fixing. All types and genders are perfectly lowercase.");
    }
}
fix();
