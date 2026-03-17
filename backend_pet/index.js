const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const petRoutes = require('./routes/petRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('PetBuddy API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
