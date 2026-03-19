// Alert Service - CRUD operations for lost pet alerts
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface LostPetAlert {
  id?: string;
  ownerName: string;
  petName: string;
  phoneNumber: string;
  species: string;
  breed: string;
  color: string;
  collar: string;
  lostDate: string;
  location: string;
  description: string;
  additionalDescription: string;
  imageUrl: string | number;
  likes: number;
  comments: number;
  createdAt?: any;
}

const COLLECTION_NAME = 'lostPetAlerts';

// Get recent alerts (limited to 5)
export const getRecentAlerts = async (): Promise<LostPetAlert[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LostPetAlert[];
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
    return [];
  }
};

// Get all alerts
export const getAllAlerts = async (): Promise<LostPetAlert[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LostPetAlert[];
  } catch (error) {
    console.error('Error fetching all alerts:', error);
    return [];
  }
};

// Get single alert by ID
export const getAlertById = async (alertId: string): Promise<LostPetAlert | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, alertId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LostPetAlert;
    }
    return null;
  } catch (error) {
    console.error('Error fetching alert:', error);
    return null;
  }
};

// Create a new alert
export const createAlert = async (alertData: Omit<LostPetAlert, 'id' | 'likes' | 'comments' | 'createdAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...alertData,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating alert:', error);
    return null;
  }
};
