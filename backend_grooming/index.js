const express = require('express');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Allow cross-origin requests from the frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL: 'https://petbuddy-138-default-rtdb.firebaseio.com',
});

const db = admin.firestore();

// POST /api/bookings/grooming — save a new grooming appointment
app.post('/api/bookings/grooming', async (req, res) => {
  try {
    const { salon, date, time, services, petName, ownerName, ownerPhone } = req.body;

    if (!petName || !ownerName || !ownerPhone || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const booking = {
      salon: salon || '—',
      date,
      time,
      services: services || [],
      petName,
      ownerName,
      ownerPhone,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('groomingBookings').add(booking);
    res.status(201).json({ success: true, bookingId: docRef.id });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking.' });
  }
});

// GET /api/bookings/grooming — fetch all grooming bookings (optional)
app.get('/api/bookings/grooming', async (req, res) => {
  try {
    const snapshot = await db.collection('groomingBookings').orderBy('createdAt', 'desc').get();
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
