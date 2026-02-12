export interface Pet {
    id: string;
    name: string;
    type: 'cat' | 'dog' | 'all';
    breed: string;
    age: string;
    image: any; // Can be require() or { uri: string }
    gender: 'male' | 'female';
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
};

export type BottomTabParamList = {
    HomeTab: undefined;
    Messages: undefined;
    Profile: undefined;
};
