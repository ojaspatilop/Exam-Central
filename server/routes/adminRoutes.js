const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Student Schema (copied from adminserver.js)
const studentSchema = new mongoose.Schema({
    rollNumber: { 
        type: String, 
        required: [true, 'Roll number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[A-Za-z0-9-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid roll number!`
        }
    },
    firstName: { 
        type: String, 
        required: [true, 'First name is required'],
        trim: true
    },
    middleName: { 
        type: String,
        trim: true,
        default: ''
    },
    lastName: { 
        type: String, 
        required: [true, 'Last name is required'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    phone: { 
        type: String, 
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
        }
    },
    branch: { 
        type: String, 
        required: [true, 'Branch is required'],
        trim: true,
        enum: {
            values: [
                'Computer Science', 
                'Information Technology', 
                'Electronics', 
                'Mechanical', 
                'Civil', 
                'Electrical',
                'AIML',
                'DS',
                'Mechanical Engineering'
            ],
            message: '{VALUE} is not a valid branch'
        }
    },
    semester: { 
        type: Number, 
        required: [true, 'Semester is required'],
        min: [1, 'Semester must be between 1 and 8'],
        max: [8, 'Semester must be between 1 and 8']
    },
    academicYear: { 
        type: Number, 
        required: [true, 'Academic year is required'],
        min: [2020, 'Academic year must be 2020 or later'],
        max: [2030, 'Academic year must be 2030 or earlier']
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Ensure indexes are set correctly
studentSchema.index({ rollNumber: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
studentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Format validation errors
studentSchema.post('save', function(error, doc, next) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        next(new Error(messages.join('. ')));
    } else if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        next(new Error(`A student with this ${field} already exists`));
    } else {
        next(error);
    }
});

// Create a connection to the admin database
const adminDbConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/exam_central', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create the Student model on the admin connection
const Student = adminDbConnection.model('students', studentSchema);

// Student Authentication Route - Primary route for login
router.post('/student/auth', async (req, res) => {
    try {
        const { rollNumber } = req.body;
        console.log('📥 Received auth request for roll number:', rollNumber);
        
        if (!rollNumber) {
            console.log('❌ No roll number provided');
            return res.status(400).json({
                success: false,
                message: "Roll number is required"
            });
        }

        console.log('🔍 Searching for student in database...');
        const student = await Student.findOne({ rollNumber });
        console.log('🔍 Search result:', student);
        
        if (!student) {
            console.log('❌ Student not found in database');
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        console.log('✅ Student found:', student.rollNumber);
        res.json({
            success: true,
            message: "Student verified successfully"
        });
    } catch (error) {
        console.error("❌ Student verification error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get all students with pagination
router.get('/students', async (req, res) => {
    try {
        console.log('📥 Received request for students list');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.branch) filter.branch = req.query.branch;
        if (req.query.semester) filter.semester = parseInt(req.query.semester);

        console.log('🔍 Applying filters:', filter);

        const total = await Student.countDocuments(filter);
        const students = await Student.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log(`✅ Found ${students.length} students`);

        res.json({
            students,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalStudents: total
        });
    } catch (error) {
        console.error('❌ Error fetching students:', error);
        res.status(500).json({ 
            message: 'Error fetching students',
            error: error.message 
        });
    }
});

// Add new student
router.post('/students', async (req, res) => {
    try {
        console.log('📥 Received new student data:', req.body);
        
        // Validate required fields
        const requiredFields = ['rollNumber', 'firstName', 'lastName', 'email', 'phone', 'branch', 'semester', 'academicYear'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields
            });
        }
        
        const newStudent = new Student(req.body);
        await newStudent.save();
        
        console.log('✅ New student added:', newStudent.rollNumber);
        res.status(201).json({
            message: 'Student added successfully',
            student: newStudent
        });
    } catch (error) {
        console.error('❌ Error adding student:', error);
        res.status(500).json({
            message: 'Error adding student',
            error: error.message
        });
    }
});

// Get student profile
router.get('/student/profile/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;
        console.log('📥 Received request for student profile:', rollNumber);
        
        const student = await Student.findOne({ rollNumber });
        
        if (!student) {
            console.log('❌ Student not found');
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        
        console.log('✅ Student profile found');
        res.json({
            success: true,
            student
        });
    } catch (error) {
        console.error('❌ Error fetching student profile:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching student profile",
            error: error.message
        });
    }
});

// Update student
router.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📥 Received update request for student ID:', id);
        
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedStudent) {
            console.log('❌ Student not found');
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        
        console.log('✅ Student updated:', updatedStudent.rollNumber);
        res.json({
            message: 'Student updated successfully',
            student: updatedStudent
        });
    } catch (error) {
        console.error('❌ Error updating student:', error);
        res.status(500).json({
            message: 'Error updating student',
            error: error.message
        });
    }
});

// Delete student
router.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📥 Received delete request for student ID:', id);
        
        const deletedStudent = await Student.findByIdAndDelete(id);
        
        if (!deletedStudent) {
            console.log('❌ Student not found');
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        
        console.log('✅ Student deleted:', deletedStudent.rollNumber);
        res.json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting student:', error);
        res.status(500).json({
            message: 'Error deleting student',
            error: error.message
        });
    }
});

// Search students
router.get('/students/search', async (req, res) => {
    try {
        const { term } = req.query;
        console.log('📥 Received search request with term:', term);
        
        if (!term) {
            return res.status(400).json({
                message: 'Search term is required'
            });
        }
        
        const searchRegex = new RegExp(term, 'i');
        const students = await Student.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { rollNumber: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ]
        }).limit(50);
        
        console.log(`✅ Found ${students.length} matching students`);
        res.json({
            students
        });
    } catch (error) {
        console.error('❌ Error searching students:', error);
        res.status(500).json({
            message: 'Error searching students',
            error: error.message
        });
    }
});

module.exports = router; 