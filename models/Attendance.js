const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentSeatNo: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    theoryAttended: {
        type: Number,
        default: 0
    },
    theoryTotal: {
        type: Number,
        default: 0
    },
    practicalAttended: {
        type: Number,
        default: 0
    },
    practicalTotal: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    attendanceHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        theoryAttended: Number,
        theoryTotal: Number,
        practicalAttended: Number,
        practicalTotal: Number,
        updatedBy: String
    }]
}, { timestamps: true });

// Calculate attendance percentages
attendanceSchema.methods.calculatePercentages = function() {
    const theoryPercentage = this.theoryTotal > 0 
        ? Math.round((this.theoryAttended / this.theoryTotal) * 100) 
        : 0;
    
    const practicalPercentage = this.practicalTotal > 0 
        ? Math.round((this.practicalAttended / this.practicalTotal) * 100) 
        : 0;
    
    const totalAttended = this.theoryAttended + this.practicalAttended;
    const totalLectures = this.theoryTotal + this.practicalTotal;
    
    const overallPercentage = totalLectures > 0 
        ? Math.round((totalAttended / totalLectures) * 100) 
        : 0;
    
    return {
        theoryPercentage,
        practicalPercentage,
        overallPercentage
    };
};

// Check if student is a defaulter (below 75% attendance)
attendanceSchema.methods.isDefaulter = function() {
    const { overallPercentage } = this.calculatePercentages();
    return overallPercentage < 75;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance; 