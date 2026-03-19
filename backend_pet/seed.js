const { admin, db } = require('./firebaseAdmin');

const PETS_DATA = [
    {
        name: 'Samantha',
        type: 'cat',
        breed: 'Persian',
        age: '6 Months',
        gender: 'female',
        color: 'Brown',
        weight: '1.2kg',
        image: 'cat_samantha.jpg',
        description: "A fluffy and calm kitten who enjoys being pampered. Samantha is looking for a quiet home where she can show off her beautiful brown coat and receive all the love she deserves.",
        shelterName: 'Happy Paws Shelter',
        location: 'Colombo ( 1.2km )',
    },
    {
        name: 'Tigri',
        type: 'cat',
        breed: 'Sphynx',
        age: '1 year',
        gender: 'female',
        color: 'Grey',
        weight: '0.8kg',
        image: 'cat_tigri.jpg',
        description: "Unique and energetic, Tigri is a social butterfly who loves warmth and head scratches. Despite her lack of fur, she has a huge heart and a playful spirit that brightens every room.",
        shelterName: 'Shelter Wish',
        location: 'Colombo ( 2.5km )',
    },
    {
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: '2 years',
        gender: 'male',
        image: 'dog_max.jpg',
        description: "The ultimate companion! Max is a loyal, friendly dog who loves long walks and playing fetch. He's a social boy who gets along perfectly with children and other pets.",
        shelterName: 'Happy Paws Shelter',
        location: 'Kandana ( 5.0km )',
    },
    {
        name: 'Bella',
        type: 'dog',
        breed: 'Labrador',
        age: '1 year',
        gender: 'female',
        image: 'dog_bella.jpg',
        description: "Bella is a sweet and gentle soul with a heart of gold. She's highly intelligent, easy to train, and always ready for a game of frisbee or a cozy cuddle on the couch.",
        shelterName: 'Care for Paws',
        location: 'Negombo ( 12.0km )',
    },
    {
        name: 'Luna',
        type: 'cat',
        breed: 'Siamese',
        age: '2 years',
        gender: 'female',
        image: 'cat_luna.jpg',
        description: "Elegant and vocal, Luna is a smart cat who loves to 'talk' to her owners. She's highly curious and enjoys high perches where she can observe her kingdom with her striking blue eyes.",
        shelterName: 'Shelter Wish',
        location: 'Colombo ( 3.0km )',
    },
    {
        name: 'Charlie',
        type: 'dog',
        breed: 'Beagle',
        age: '3 years',
        gender: 'male',
        image: 'dog_charlie.jpg',
        description: "Charlie is a curious explorer with a fantastic sense of smell. He's a happy-go-lucky dog who enjoys outdoor adventures and has a tail that never stops wagging.",
        shelterName: 'Happy Paws Shelter',
        location: 'Colombo ( 0.8km )',
    },
    {
        name: 'Daisy',
        type: 'dog',
        breed: 'Corgi',
        age: '8 months',
        gender: 'female',
        image: 'dog_daisy.jpg',
        description: "Small in size but big in personality! Daisy is a spunky puppy who loves to run and play. Her short legs don't stop her from being the fastest one at the park.",
        shelterName: 'Care for Paws',
        location: 'Wattala ( 4.5km )',
    },
    {
        name: 'Oliver',
        type: 'cat',
        breed: 'Maine Coon',
        age: '4 years',
        gender: 'male',
        image: 'cat_oliver.jpg',
        description: "A gentle giant with a majestic presence. Oliver is a laid-back cat who enjoys being brushed and lounging in sunbeams. He's more like a dog than a cat in his loyalty.",
        shelterName: 'Shelter Wish',
        location: 'Colombo ( 6.2km )',
    },
    {
        name: 'Milo',
        type: 'dog',
        breed: 'French Bulldog',
        age: '1.5 years',
        gender: 'male',
        image: 'dog_milo.jpg',
        description: "Milo is a charming little fellow who is full of energy. He loves sitting on laps and being the center of attention. He's the perfect apartment companion with a big personality.",
        shelterName: 'Happy Paws Shelter',
        location: 'Colombo ( 2.1km )',
    },
    {
        name: 'Rosie',
        type: 'dog',
        breed: 'Poodle',
        age: '2 years',
        gender: 'female',
        image: 'dog_rosie.jpg',
        description: "Highly intelligent and stylish, Rosie is a graceful dog who loves learning new tricks. She's very affectionate and thrives in a home where she can be part of every activity.",
        shelterName: 'Care for Paws',
        location: 'Negombo ( 15.0km )',
    },
    {
        name: 'Simba',
        type: 'cat',
        breed: 'Bengal',
        age: '3 years',
        gender: 'male',
        image: 'cat_simba.jpg',
        description: "Simba has a wild look and a courageous heart. He's an active cat who needs plenty of play and interaction. He's particularly fond of water and chasing feather toys.",
        shelterName: 'Shelter Wish',
        location: 'Colombo ( 4.2km )',
    },
    {
        name: 'Cooper',
        type: 'dog',
        breed: 'German Shepherd',
        age: '4 years',
        gender: 'male',
        image: 'dog_cooper.jpg',
        description: "Cooper is a brave and disciplined dog with strong protective instincts. He's a loyal partner who is always ready for a hike or a training session. He's a true hero at heart.",
        shelterName: 'Happy Paws Shelter',
        location: 'Kandy ( 115km )',
    },
    {
        name: 'Nala',
        type: 'cat',
        breed: 'Ragdoll',
        age: '1 year',
        gender: 'female',
        image: 'cat_nala.jpg',
        description: "True to her breed name, Nala goes limp with affection when held. She's a peaceful cat who loves quiet afternoons and follow her favorite humans from room to room.",
        shelterName: 'Shelter Wish',
        location: 'Colombo ( 3.5km )',
    },
    {
        name: 'Buddy',
        type: 'dog',
        breed: 'Boxer',
        age: '2 years',
        gender: 'male',
        image: 'dog_buddy.jpg',
        description: "Buddy is a bundle of joy with a constant wagging tail. He's a playful, goofy dog who will keep you laughing with his antics and is always ready for a new friend.",
        shelterName: 'Care for Paws',
        location: 'Wattala ( 7.0km )',
    },
];

const seedDatabase = async () => {
    try {
        console.log('Cleaning existing pets...');
        const petsCollection = db.collection('pets');
        const snapshot = await petsCollection.get();
        console.log(`Found ${snapshot.size} pets to delete.`);

        const deleteBatch = db.batch();
        snapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log('Old pets deleted.');

        console.log('Seeding new pet data...');
        const batch = db.batch();
        PETS_DATA.forEach((pet, index) => {
            const docRef = petsCollection.doc();
            batch.set(docRef, {
                ...pet,
                contactPhone: '0765743454',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        console.log('Committing batch...');
        await batch.commit();
        console.log('Database seeded successfully with ' + PETS_DATA.length + ' pets!');
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR during seeding:', error);
        process.exit(1);
    }
};

seedDatabase();
