const mongoose = require('mongoose');

// Create connection to GradeCardDB
const gradeCardDbConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/GradeCardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

gradeCardDbConnection.on('connected', () => {
    console.log('Connected to GradeCardDB Database');
});

gradeCardDbConnection.on('error', (err) => {
    console.error('GradeCardDB connection error:', err);
});

const gradeCardSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        index: true
    },
    studentName: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    subjects: [{
        name: {
            type: String,
            required: true
        },
        semesterMarks: {
            type: Number,
            default: 0,
            min: 0,
            max: 75
        },
        internalMarks: {
            type: Number,
            default: 0,
            min: 0,
            max: 25
        },
        practicalMarks: {
            type: Number,
            default: 0,
            min: 0,
            max: 25
        },
        termworkMarks: {
            type: Number,
            default: 0,
            min: 0,
            max: 25
        },
        totalMarks: {
            type: Number,
            default: 0
        },
        grade: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'E', 'F'],
            default: 'F'
        }
    }],
    sgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    result: {
        type: String,
        enum: ['PASS', 'FAIL'],
        required: true
    },
    academicYear: {
        type: Number,
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index for faster lookups
gradeCardSchema.index({ rollNumber: 1, semester: 1 });

module.exports = gradeCardDbConnection.model('GradeCard', gradeCardSchema); 