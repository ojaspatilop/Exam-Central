const express = require('express');
const router = express.Router();
const Attendance = require('../../models/Attendance');
const auth = require('../../middleware/auth');

// Get attendance for a specific student
router.get('/:studentId', auth, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({
            studentId: req.params.studentId,
            facultyId: req.faculty.id
        });
        
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'No attendance record found for this student' });
        }
        
        const percentages = attendance.calculatePercentages();
        
        res.json({
            success: true,
            attendance: {
                ...attendance._doc,
                ...percentages,
                isDefaulter: attendance.isDefaulter()
            }
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update attendance for a student
router.post('/update/:studentId', auth, async (req, res) => {
    try {
        const { theoryAttended, theoryTotal, practicalAttended, practicalTotal, subject } = req.body;
        
        // Find existing attendance record or create a new one
        let attendance = await Attendance.findOne({
            studentId: req.params.studentId,
            facultyId: req.faculty.id
        });
        
        if (!attendance) {
            // Get student details from req.body
            const { studentName, studentSeatNo, branch, semester } = req.body;
            
            if (!studentName || !studentSeatNo || !branch || !semester) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Student details are required for creating a new attendance record' 
                });
            }
            
            // Create new attendance record
            attendance = new Attendance({
                studentId: req.params.studentId,
                facultyId: req.faculty.id,
                studentName,
                studentSeatNo,
                branch,
                semester,
                subject,
                theoryAttended,
                theoryTotal,
                practicalAttended,
                practicalTotal,
                attendanceHistory: [{
                    date: new Date(),
                    theoryAttended,
                    theoryTotal,
                    practicalAttended,
                    practicalTotal,
                    updatedBy: req.faculty.name
                }]
            });
        } else {
            // Update existing attendance record
            attendance.theoryAttended = theoryAttended;
            attendance.theoryTotal = theoryTotal;
            attendance.practicalAttended = practicalAttended;
            attendance.practicalTotal = practicalTotal;
            attendance.subject = subject || attendance.subject;
            attendance.lastUpdated = new Date();
            
            // Add to attendance history
            attendance.attendanceHistory.push({
                date: new Date(),
                theoryAttended,
                theoryTotal,
                practicalAttended,
                practicalTotal,
                updatedBy: req.faculty.name
            });
        }
        
        await attendance.save();
        
        const percentages = attendance.calculatePercentages();
        
        res.json({
            success: true,
            message: 'Attendance updated successfully',
            attendance: {
                ...attendance._doc,
                ...percentages,
                isDefaulter: attendance.isDefaulter()
            }
        });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get attendance history for a student
router.get('/history/:studentId', auth, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({
            studentId: req.params.studentId,
            facultyId: req.faculty.id
        });
        
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'No attendance record found for this student' });
        }
        
        res.json({
            success: true,
            history: attendance.attendanceHistory
        });
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get defaulters list
router.get('/defaulters/list', auth, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({
            facultyId: req.faculty.id
        });
        
        const defaulters = attendanceRecords.filter(record => record.isDefaulter());
        
        res.json({
            success: true,
            defaulters: defaulters.map(record => ({
                id: record.studentId,
                name: record.studentName,
                seatNo: record.studentSeatNo,
                branch: record.branch,
                semester: record.semester,
                subject: record.subject,
                ...record.calculatePercentages()
            }))
        });
    } catch (error) {
        console.error('Error fetching defaulters list:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;