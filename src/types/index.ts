export interface Pet {
    id: string;
    name: string;
    type: 'cat' | 'dog' | 'all';
    breed: string;
    age: string;
    image: any; // Can be require() or { uri: string }
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
    Main: undefined;
    Home: undefined;
    PetDetails: { pet: Pet };
    AdoptionForm: { pet: Pet };
};

export type BottomTabParamList = {
    HomeTab: undefined;
    Messages: undefined;
    Profile: undefined;
};
