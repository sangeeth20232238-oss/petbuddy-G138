const { admin, db, storage } = require('../firebaseAdmin');

const petsCollection = db.collection('pets');
const bucket = storage ? storage.bucket() : null;

exports.getAllPets = async (req, res) => {
    try {
        const snapshot = await petsCollection.get();
        const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPetById = async (req, res) => {
    try {
        const doc = await petsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPet = async (req, res) => {
    try {
        const { name, ...rest } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Pet name is required' });
        }

        let uploadedUrl = null;

        // If an image file was uploaded via FormData, upload it securely to Firebase Storage
        if (req.file && bucket) {
            const filename = `pets/${Date.now()}_${req.file.originalname}`;
            const file = bucket.file(filename);

            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                    cacheControl: 'public, max-age=31536000',
                }
            });

            await file.makePublic();
            uploadedUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        }

        const newPet = { 
            name, 
            ...rest,
            ...(uploadedUrl && { image: uploadedUrl }), // Store new Firebase Storage link if file attached
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await petsCollection.add(newPet);
        res.status(201).json({ id: docRef.id, ...newPet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        await petsCollection.doc(id).update(req.body);
        res.status(200).json({ message: 'Pet updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePet = async (req, res) => {
    try {
        await petsCollection.doc(req.params.id).delete();
        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
