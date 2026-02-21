const { admin, db } = require('../firebaseAdmin');

const adoptionsCollection = db.collection('adoptions');

exports.createAdoptionRequest = async (req, res) => {
    try {
        console.log('Incoming Adoption Request Body:', req.body);

        // Support both 'petId' and 'id' as the pet identifier
        const petId = req.body.petId || req.body.id;
        let petData = {};

        if (petId) {
            console.log('Looking up pet with ID:', petId);
            const petDoc = await db.collection('pets').doc(petId).get();
            if (petDoc.exists) {
                const data = petDoc.data();
                console.log('Pet found:', data.name);
                petData = {
                    petName: data.name,
                    petType: data.type
                };
            } else {
                console.log('Pet NOT found in database for ID:', petId);
            }
        } else {
            console.log('No petId or id provided in request body');
        }

        const newRequest = {
            ...req.body,
            ...petData,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        console.log('Saving to Firestore:', newRequest);
        const docRef = await adoptionsCollection.add(newRequest);
        console.log('Adoption request saved successfully with ID:', docRef.id);

        // Convert Firestore object for response (remove FieldValue which doesn't serialize to JSON well)
        const responseData = {
            id: docRef.id,
            ...newRequest,
            createdAt: new Date().toISOString() // Placeholder for the server timestamp in the immediate response
        };

        res.status(201).json(responseData);
    } catch (error) {
        console.error('CRITICAL ERROR in createAdoptionRequest:', error);
        res.status(500).json({
            error: 'Failed to process adoption request',
            message: error.message
        });
    }
};

exports.getAllAdoptionRequests = async (req, res) => {
    try {
        const snapshot = await adoptionsCollection.orderBy('createdAt', 'desc').get();
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
