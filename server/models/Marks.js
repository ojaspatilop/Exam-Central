const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    marks: {
        semester: {
            type: Number,
            default: 0,
            min: 0,
            max: 75
        },
        internal: {
            type: Number,
            default: 0,
            min: 0,
            max: 25
        },
        practical: {
            type: Number,
            default: 0,
            min: 0,
            max: 25
        },
        termwork: {
            type: Number,
            default: 0,
            min: 0,
            max: 25
        }
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    grade: {
        type: String,
        default: 'F'
    },
    status: {
        type: String,
        enum: ['Pass', 'Fail'],
        default: 'Fail'
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
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

// Pre-save hook to calculate total marks and grade
marksSchema.pre('save', function(next) {
    // Calculate total marks
    const marks = this.marks;
    this.totalMarks = (marks.semester || 0) + (marks.internal || 0) + 
                      (marks.practical || 0) + (marks.termwork || 0);
    
    // Calculate grade based on percentage
    const maxMarks = 150; // 75 + 25 + 25 + 25
    const percentage = (this.totalMarks / maxMarks) * 100;
    
    if (percentage >= 80) {
        this.grade = 'A';
    } else if (percentage >= 70) {
        this.grade = 'B';
    } else if (percentage >= 60) {
        this.grade = 'C';
    } else if (percentage >= 50) {
        this.grade = 'D';
    } else if (percentage >= 40) {
        this.grade = 'E';
    } else {
        this.grade = 'F';
    }
    
    // Set pass/fail status (assuming 40% is passing)
    this.status = percentage >= 40 ? 'Pass' : 'Fail';
    
    // Update the updatedAt timestamp
    this.updatedAt = Date.now();
    
    next();
});

module.exports = mongoose.model('Marks', marksSchema); 