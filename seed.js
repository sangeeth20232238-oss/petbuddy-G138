const { db } = require('./firebaseAdmin');

const PETS_DATA = [
    {
        name: 'Samantha',
        type: 'cat',
        breed: 'Persian',
        age: '6 Months',
        gender: 'female',
        color: 'Brown',
        weight: '1.2kg',
        image: 'cat_samantha.jpg', // Reference name for frontend local assets
        description: "A fluffy and calm kitten who enjoys being pampered. Samantha is looking for a quiet home where she can show off her beautiful brown coat and receive all the love she deserves.",
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
    },
    {
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: '2 years',
        gender: 'male',
        image: 'dog_max.jpg',
        description: "The ultimate companion! Max is a loyal, friendly dog who loves long walks and playing fetch. He's a social boy who gets along perfectly with children and other pets.",
    },
    {
        name: 'Bella',
        type: 'dog',
        breed: 'Labrador',
        age: '1 year',
        gender: 'female',
        image: 'dog_bella.jpg',
        description: "Bella is a sweet and gentle soul with a heart of gold. She's highly intelligent, easy to train, and always ready for a game of frisbee or a cozy cuddle on the couch.",
    },
    {
        name: 'Luna',
        type: 'cat',
        breed: 'Siamese',
        age: '2 years',
        gender: 'female',
        image: 'cat_luna.jpg',
        description: "Elegant and vocal, Luna is a smart cat who loves to 'talk' to her owners. She's highly curious and enjoys high perches where she can observe her kingdom with her striking blue eyes.",
    },
    {
        name: 'Charlie',
        type: 'dog',
        breed: 'Beagle',
        age: '3 years',
        gender: 'male',
        image: 'dog_charlie.jpg',
        description: "Charlie is a curious explorer with a fantastic sense of smell. He's a happy-go-lucky dog who enjoys outdoor adventures and has a tail that never stops wagging.",
    },
    {
        name: 'Daisy',
        type: 'dog',
        breed: 'Corgi',
        age: '8 months',
        gender: 'female',
        image: 'dog_daisy.jpg',
        description: "Small in size but big in personality! Daisy is a spunky puppy who loves to run and play. Her short legs don't stop her from being the fastest one at the park.",
    },
    {
        name: 'Oliver',
        type: 'cat',
        breed: 'Maine Coon',
        age: '4 years',
        gender: 'male',
        image: 'cat_oliver.jpg',
        description: "A gentle giant with a majestic presence. Oliver is a laid-back cat who enjoys being brushed and lounging in sunbeams. He's more like a dog than a cat in his loyalty.",
    },
    {
        name: 'Milo',
        type: 'dog',
        breed: 'French Bulldog',
        age: '1.5 years',
        gender: 'male',
        image: 'dog_milo.jpg',
        description: "Milo is a charming little fellow who is full of energy. He loves sitting on laps and being the center of attention. He's the perfect apartment companion with a big personality.",
    },
    {
        name: 'Rosie',
        type: 'dog',
        breed: 'Poodle',
        age: '2 years',
        gender: 'female',
        image: 'dog_rosie.jpg',
        description: "Highly intelligent and stylish, Rosie is a graceful dog who loves learning new tricks. She's very affectionate and thrives in a home where she can be part of every activity.",
    },
];

const seedDatabase = async () => {
    try {
        console.log('Cleaning existing pets...');
        const petsCollection = db.collection('pets');
        const snapshot = await petsCollection.get();
        const deleteBatch = db.batch();
        snapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();

        console.log('Seeding new pet data...');
        const batch = db.batch();
        PETS_DATA.forEach((pet) => {
            const docRef = petsCollection.doc();
            batch.set(docRef, pet);
        });

        await batch.commit();
        console.log('Database seeded successfully with local image references!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
