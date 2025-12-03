const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/examcentral', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schemas
const StudentSchema = new mongoose.Schema({
    name: String,
    seatNumber: String,
    branch: String,
    semester: String,
    rollNumber: String
});

const MarksSchema = new mongoose.Schema({
    seatNumber: String,
    subject: String,
    semester: String,
    marks: {
        semester: Number,
        internal: Number,
        practical: Number,
        termwork: Number
    }
});

const Student = mongoose.model('Student', StudentSchema);
const Marks = mongoose.model('Marks', MarksSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes
app.get('/api/faculty/student/:seatNumber', authenticateToken, async (req, res) => {
    try {
        const student = await Student.findOne({ seatNumber: req.params.seatNumber });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/faculty/marks/:seatNumber', authenticateToken, async (req, res) => {
    try {
        const marks = await Marks.find({ seatNumber: req.params.seatNumber });
        res.json({ success: true, marks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/faculty/marks', authenticateToken, async (req, res) => {
    try {
        const { seatNumber, subject, semester, marks } = req.body;
        
        // Update or create marks
        const result = await Marks.findOneAndUpdate(
            { seatNumber, subject, semester },
            { marks },
            { upsert: true, new: true }
        );

        res.json({ success: true, marks: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Faculty info endpoint
app.get('/api/faculty/info', authenticateToken, (req, res) => {
    // Return faculty info from the token
    res.json({
        success: true,
        department: req.user.department || 'Computer Engineering'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 