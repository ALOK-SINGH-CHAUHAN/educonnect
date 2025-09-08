const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB connection - supports both local and cloud databases
let MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

// If no environment variable is set, use local MongoDB
if (!MONGODB_URI) {
    MONGODB_URI = 'mongodb://localhost:27017/student-teacher-portal';
} else {
    // If DATABASE_URL is set but not a MongoDB URL, fall back to local
    if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
        console.log('DATABASE_URL is not a MongoDB URL, using local MongoDB');
        MONGODB_URI = 'mongodb://localhost:27017/student-teacher-portal';
    }
}

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database URL:', MONGODB_URI.includes('@') ? MONGODB_URI.split('@')[1] : 'localhost');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Please make sure MongoDB is running or provide a valid MONGODB_URI environment variable');
});

// Import routes
const authRoutes = require('./auth');

// Routes
app.use('/api', authRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});