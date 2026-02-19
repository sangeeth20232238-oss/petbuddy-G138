import { ImageSourcePropType } from 'react-native';

export interface Pet {
    id: string;
    name: string;
    type: 'cat' | 'dog';
    breed: string;
    age: string;
    image: ImageSourcePropType;
    gender: 'male' | 'female';
    color?: string;
    weight?: string;
    description?: string;
}

export interface PetCategory {
    id: string;
    name: string;
    icon: string;
    type: 'cat' | 'dog' | 'all';
}

export type RootStackParamList = {
    Home: undefined;
    PetDetails: { pet: Pet };
    AdoptionForm: undefined;
};

export type BottomTabParamList = {
    HomeTab: undefined;
    Messages: undefined;
    Profile: undefined;
};
