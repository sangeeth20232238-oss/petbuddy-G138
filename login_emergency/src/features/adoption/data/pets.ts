import { Pet } from '../types';

export const PETS_DATA: Pet[] = [];

export const getPetImage = (imagePath: string) => {
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
        default: return require('../../../../assets/pets/dog.png'); // Fallback
    }
};
