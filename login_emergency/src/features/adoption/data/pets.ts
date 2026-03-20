import { Pet } from '../types';

export const PETS_DATA: Pet[] = [
    { id: '1', name: 'Samantha', type: 'cat', breed: 'Persian', age: '2 years', gender: 'female', image: require('../../../../assets/pets/cat_samantha.jpg'), description: 'A sweet and calm Persian cat looking for a loving home.' },
    { id: '2', name: 'Tigri', type: 'cat', breed: 'Tabby', age: '1 year', gender: 'male', image: require('../../../../assets/pets/cat_tigri.jpg'), description: 'Playful and energetic tabby cat who loves to explore.' },
    { id: '3', name: 'Luna', type: 'cat', breed: 'Siamese', age: '3 years', gender: 'female', image: require('../../../../assets/pets/cat_luna.jpg'), description: 'Elegant Siamese cat with beautiful blue eyes.' },
    { id: '4', name: 'Oliver', type: 'cat', breed: 'British Shorthair', age: '2 years', gender: 'male', image: require('../../../../assets/pets/cat_oliver.jpg'), description: 'Calm and affectionate British Shorthair.' },
    { id: '5', name: 'Simba', type: 'cat', breed: 'Maine Coon', age: '4 years', gender: 'male', image: require('../../../../assets/pets/cat_simba.jpg'), description: 'Majestic Maine Coon with a fluffy coat.' },
    { id: '6', name: 'Nala', type: 'cat', breed: 'Ragdoll', age: '1.5 years', gender: 'female', image: require('../../../../assets/pets/cat_nala.jpg'), description: 'Gentle Ragdoll cat who loves cuddles.' },
    { id: '7', name: 'Max', type: 'dog', breed: 'Labrador', age: '3 years', gender: 'male', image: require('../../../../assets/pets/dog_max.jpg'), description: 'Friendly and loyal Labrador who loves to play fetch.' },
    { id: '8', name: 'Bella', type: 'dog', breed: 'Golden Retriever', age: '2 years', gender: 'female', image: require('../../../../assets/pets/dog_bella.jpg'), description: 'Sweet Golden Retriever great with kids and families.' },
    { id: '9', name: 'Charlie', type: 'dog', breed: 'Beagle', age: '1 year', gender: 'male', image: require('../../../../assets/pets/dog_charlie.jpg'), description: 'Curious and cheerful Beagle full of energy.' },
    { id: '10', name: 'Daisy', type: 'dog', breed: 'Poodle', age: '2 years', gender: 'female', image: require('../../../../assets/pets/dog_daisy.jpg'), description: 'Intelligent and elegant Poodle.' },
    { id: '11', name: 'Milo', type: 'dog', breed: 'Husky', age: '3 years', gender: 'male', image: require('../../../../assets/pets/dog_milo.jpg'), description: 'Energetic Husky who loves outdoor adventures.' },
    { id: '12', name: 'Rosie', type: 'dog', breed: 'Shih Tzu', age: '1.5 years', gender: 'female', image: require('../../../../assets/pets/dog_rosie.jpg'), description: 'Adorable Shih Tzu with a loving personality.' },
    { id: '13', name: 'Cooper', type: 'dog', breed: 'Cocker Spaniel', age: '2 years', gender: 'male', image: require('../../../../assets/pets/dog_cooper.jpg'), description: 'Gentle Cocker Spaniel who loves long walks.' },
    { id: '14', name: 'Buddy', type: 'dog', breed: 'German Shepherd', age: '4 years', gender: 'male', image: require('../../../../assets/pets/dog_buddy.jpg'), description: 'Loyal and intelligent German Shepherd.' },
];

export const getPetImage = (imagePath: string) => {
    if (!imagePath) return require('../../../../assets/pets/dog.png');
    
    // Check if it's a remote URL
    if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('file://')) {
        return { uri: imagePath };
    }

    switch (imagePath) {
        case 'cat_samantha.jpg': return require('../../../../assets/pets/cat_samantha.jpg');
        case 'cat_tigri.jpg': return require('../../../../assets/pets/cat_tigri.jpg');
        case 'dog_max.jpg': return require('../../../../assets/pets/dog_max.jpg');
        case 'dog_bella.jpg': return require('../../../../assets/pets/dog_bella.jpg');
        case 'cat_luna.jpg': return require('../../../../assets/pets/cat_luna.jpg');
        case 'dog_charlie.jpg': return require('../../../../assets/pets/dog_charlie.jpg');
        case 'dog_daisy.jpg': return require('../../../../assets/pets/dog_daisy.jpg');
        case 'cat_oliver.jpg': return require('../../../../assets/pets/cat_oliver.jpg');
        case 'dog_milo.jpg': return require('../../../../assets/pets/dog_milo.jpg');
        case 'dog_rosie.jpg': return require('../../../../assets/pets/dog_rosie.jpg');
        case 'cat_simba.jpg': return require('../../../../assets/pets/cat_simba.jpg');
        case 'dog_cooper.jpg': return require('../../../../assets/pets/dog_cooper.jpg');
        case 'cat_nala.jpg': return require('../../../../assets/pets/cat_nala.jpg');
        case 'dog_buddy.jpg': return require('../../../../assets/pets/dog_buddy.jpg');
        default: return require('../../../../assets/pets/dog.png');
    }
};
