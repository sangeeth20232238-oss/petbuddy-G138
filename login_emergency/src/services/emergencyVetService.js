import { db } from '../../firebaseConfig';
import {
    collection, getDocs, addDoc, serverTimestamp, query, where
} from 'firebase/firestore';

// Fetch all clinics
export async function fetchClinics() {
    const snap = await getDocs(collection(db, 'clinics'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Fetch doctors for a specific clinic
export async function fetchDoctors(clinicId) {
    const snap = await getDocs(collection(db, 'clinics', clinicId, 'doctors'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Save a booking when patient taps "Book Now"
export async function createBooking({ userId, clinicId, clinicName, doctorId, doctorName, date, timeSlot }) {
    return await addDoc(collection(db, 'bookings'), {
        userId,
        clinicId,
        clinicName,
        doctorId,
        doctorName,
        date,
        timeSlot,
        status: 'pending',   // clinic changes this to 'confirmed' or 'rejected'
        createdAt: serverTimestamp(),
    });
}

// Fetch bookings for the logged-in patient
export async function fetchUserBookings(userId) {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
