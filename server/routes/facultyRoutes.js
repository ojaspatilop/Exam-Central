const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Marks = require('../models/Marks');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create connection to GradeCardDB database
const gradeCardDbConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/GradeCardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

gradeCardDbConnection.on('connected', () => {
    console.log('Connected to GradeCardDB Database for faculty routes');
});

gradeCardDbConnection.on('error', (err) => {
    console.error('GradeCardDB connection error in faculty routes:', err);
});

// Create connection to exam_attendance database
const attendanceDbConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/exam_attendance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

attendanceDbConnection.on('connected', () => {
    console.log('Connected to exam_attendance Database for faculty routes');
});

attendanceDbConnection.on('error', (err) => {
    console.error('exam_attendance connection error in faculty routes:', err);
});

// Define the Attendance Schema
const attendanceSchema = new mongoose.Schema({
    examDate: {
        type: Date,
        required: true
    },
    examTime: {
        type: String,
        required: true
    },
    paperCode: {
        type: String,
        required: true
    },
    paperName: {
        type: String,
        required: true
    },
    classroom: {
        building: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true
        }
    },
    supervisorId: {
        type: String,
        required: true
    },
    students: [{
        hallTicketNumber: {
            type: String,
            required: true
        },
        studentName: String,
        isPresent: {
            type: Boolean,
            default: true
        },
        markedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Attendance model with the attendance connection
const Attendance = attendanceDbConnection.model('Attendance', attendanceSchema);

// Import GradeCard schema and create model with the GradeCardDB connection
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

// Create GradeCard model with the GradeCardDB connection
const GradeCard = gradeCardDbConnection.model('GradeCard', gradeCardSchema);

// Middleware to verify faculty token
const verifyFacultyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.facultyId = decoded.userId; // Changed from decoded.id to decoded.userId to match auth token
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Create connection to exam_central database
const studentDbConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/exam_central", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Student Schema to match the admin schema
const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    branch: { 
        type: String, 
        required: true,
        enum: [
            'Computer Science',
            'Information Technology',
            'Electronics',
            'Mechanical',
            'Civil',
            'Electrical',
            'AIML',
            'DS',
            'Mechanical Engineering'
        ]
    },
    semester: { 
        type: Number, 
        required: true,
        min: 1,
        max: 8
    },
    academicYear: { 
        type: Number, 
        required: true
    }
});

// Create Student model
const Student = studentDbConnection.model('students', studentSchema);

// Department to Branch mapping
const departmentToBranchMap = {
    'AIML': 'AIML',
    'DS': 'DS',
    'IT': 'IT',
    'CS': 'CS',
    'ME': 'ME',
};

// Branch to Department mapping
const branchToDepartmentMap = {
    'AIML': 'AIML',
    'DS': 'DS',
    'IT': 'IT',
    'CS': 'CS',
    'ME': 'ME',
    'Computer Science': 'CS',
    'Information Technology': 'IT',
    'Mechanical Engineering': 'ME',
    'Computer Engineering': 'CS',
    'Electronics & Telecomm': 'EXTC'
};

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        // Accept only excel files
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'), false);
        }
    }
});

// Get faculty info
router.get('/info', verifyFacultyToken, async (req, res) => {
    try {
        const Faculty = req.app.locals.Faculty;
        console.log('Looking for faculty with ID:', req.facultyId);
        
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        res.json({
            success: true,
            name: faculty.personalInfo.name,
            email: faculty.personalInfo.email,
            department: faculty.professionalInfo.department
        });
    } catch (error) {
        console.error('Error fetching faculty info:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get faculty profile
router.get('/profile', verifyFacultyToken, async (req, res) => {
    try {
        const Faculty = req.app.locals.Faculty;
        console.log('Fetching profile for faculty ID:', req.facultyId);
        
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        // Structure the response data
        const profileData = {
            success: true,
            personalInfo: {
                name: faculty.personalInfo.name,
                email: faculty.personalInfo.email,
                age: faculty.personalInfo.age,
                gender: faculty.personalInfo.gender,
                contact: faculty.personalInfo.contact,
                address: faculty.personalInfo.address
            },
            professionalInfo: {
                designation: faculty.professionalInfo.designation,
                department: faculty.professionalInfo.department,
                experience: faculty.professionalInfo.experience,
                specialization: faculty.professionalInfo.specialization
            },
            otherDetails: {
                socialLinks: {
                    linkedin: faculty.otherDetails.socialLinks?.linkedin || '',
                    github: faculty.otherDetails.socialLinks?.github || ''
                }
            }
        };

        console.log('Sending profile data:', profileData);
        res.json(profileData);
    } catch (error) {
        console.error('Error fetching faculty profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Add this new route to get department-specific students
router.get('/my-students', verifyFacultyToken, async (req, res) => {
    try {
        const Faculty = req.app.locals.Faculty;
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: 'Faculty not found' 
            });
        }

        // Get faculty's department
        const facultyDepartment = faculty.professionalInfo.department;
        
        // Get corresponding branch
        const branchName = departmentToBranchMap[facultyDepartment];

        if (!branchName) {
            console.error('No branch mapping found for department:', facultyDepartment);
            return res.status(400).json({
                success: false,
                message: 'Invalid department mapping'
            });
        }

        // Find students with matching branch
        const students = await Student.find({ 
            branch: branchName
        });

        console.log(`Found ${students.length} students for branch ${branchName}`);

        // Transform the data to match the frontend expectations
        const transformedStudents = students.map(student => ({
            id: student._id,
            seatNo: student.rollNumber,
            name: `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim(),
            branch: student.branch,
            semester: student.semester,
            email: student.email,
            phone: student.phone,
            attendance: {
                theory: 0,
                practical: 0,
                overall: 0
            },
            performance: 0
        }));

        res.json({
            success: true,
            students: transformedStudents
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Get student by seat number
router.get('/student/:seatNumber', verifyFacultyToken, async (req, res) => {
    try {
        const { seatNumber } = req.params;
        
        // Get faculty information
        const Faculty = req.app.locals.Faculty;
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: 'Faculty not found' 
            });
        }
        
        // Get faculty's department
        const facultyDepartment = faculty.professionalInfo.department;
        
        // Find student by roll number
        const student = await Student.findOne({ rollNumber: seatNumber });
        
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
        
        // Map student's branch to department
        const studentBranch = student.branch;
        const studentDepartment = branchToDepartmentMap[studentBranch] || studentBranch;
        
        // Check if faculty's department matches student's department
        if (facultyDepartment !== studentDepartment) {
            return res.status(403).json({
                success: false,
                message: 'You can only access students from your department'
            });
        }
        
        // Transform student data
        const transformedStudent = {
            id: student._id,
            name: `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim(),
            rollNo: student.rollNumber,
            seatNo: student.rollNumber,
            branch: student.branch,
            semester: student.semester,
            email: student.email,
            phone: student.phone
        };
        
        res.json({
            success: true,
            student: transformedStudent
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get existing marks for a student
router.get('/marks/:rollNumber/:subject/:semester', verifyFacultyToken, async (req, res) => {
    try {
        const { rollNumber, subject, semester } = req.params;
        
        console.log(`Fetching marks for rollNumber: ${rollNumber}, subject: ${subject}, semester: ${semester}`);
        
        // Find marks for the student, subject, and semester
        const marks = await Marks.findOne({ 
            rollNumber, 
            subject, 
            semester 
        });
        
        console.log('Marks found:', marks);
        
        if (!marks) {
            return res.json({ success: true, message: 'No marks found', marks: null });
        }
        
        // Return marks
        res.json({
            success: true,
            marks: marks.marks
        });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save marks for a student
router.post('/marks', verifyFacultyToken, async (req, res) => {
    try {
        const { seatNumber, subject, semester, marks } = req.body;
        
        if (!seatNumber || !subject || !semester || !marks) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        // Get faculty information
        const Faculty = req.app.locals.Faculty;
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: 'Faculty not found' 
            });
        }
        
        // Get faculty's department
        const facultyDepartment = faculty.professionalInfo.department;
        
        // Find student by roll number
        const student = await Student.findOne({ rollNumber: seatNumber });
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        // Map student's branch to department
        const studentBranch = student.branch;
        const studentDepartment = branchToDepartmentMap[studentBranch] || studentBranch;
        
        // Check if faculty's department matches student's department
        if (facultyDepartment !== studentDepartment) {
            return res.status(403).json({
                success: false,
                message: 'You can only manage students from your department'
            });
        }
        
        // Check if marks already exist for this student, subject, and semester
        let existingMarks = await Marks.findOne({ 
            rollNumber: seatNumber, 
            subject, 
            semester 
        });
        
        if (existingMarks) {
            // Update existing marks
            existingMarks.marks = marks;
            await existingMarks.save();
            
            return res.json({ 
                success: true, 
                message: 'Marks updated successfully',
                marks: existingMarks
            });
        }
        
        // Create new marks record
        const newMarks = new Marks({
            studentId: student._id,
            rollNumber: seatNumber,
            subject,
            semester,
            marks,
            facultyId: req.facultyId
        });
        
        await newMarks.save();
        
        res.json({ 
            success: true, 
            message: 'Marks saved successfully',
            marks: newMarks
        });
    } catch (error) {
        console.error('Error saving marks:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Generate grade card for a student
router.get('/gradecard/:rollNumber', verifyFacultyToken, async (req, res) => {
    try {
        const { rollNumber } = req.params;
        
        // Find student by roll number
        const student = await Student.findOne({ rollNumber });
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        // Find all marks for the student
        const allMarks = await Marks.find({ rollNumber });
        
        if (!allMarks || allMarks.length === 0) {
            return res.status(404).json({ success: false, message: 'No marks found for this student' });
        }
        
        // Group marks by subject
        const subjects = [];
        const subjectMap = {};
        
        allMarks.forEach(mark => {
            const subjectKey = `${mark.subject}-${mark.semester}`;
            
            if (!subjectMap[subjectKey]) {
                subjectMap[subjectKey] = {
                    name: mark.subject,
                    semesterMarks: mark.marks.semester,
                    internalMarks: mark.marks.internal,
                    practicalMarks: mark.marks.practical,
                    termworkMarks: mark.marks.termwork,
                    totalMarks: mark.totalMarks,
                    grade: mark.grade
                };
                
                subjects.push(subjectMap[subjectKey]);
            }
        });
        
        // Calculate SGPA (Simple average for now)
        let totalGradePoints = 0;
        const gradePoints = { 'A': 10, 'B': 8, 'C': 6, 'D': 4, 'E': 2, 'F': 0 };
        
        subjects.forEach(subject => {
            totalGradePoints += gradePoints[subject.grade] || 0;
        });
        
        const sgpa = subjects.length > 0 ? (totalGradePoints / subjects.length).toFixed(2) : 0;
        
        // Determine overall result
        const hasFailed = subjects.some(subject => subject.grade === 'F');
        const result = hasFailed ? 'FAIL' : 'PASS';
        
        // Prepare grade card data
        const gradeCardData = {
            success: true,
            student: {
                name: `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`,
                seatNo: student.rollNumber,
                branch: student.branch,
                semester: student.semester
            },
            subjects,
            sgpa,
            result
        };
        
        // Save the grade card to the database
        try {
            // Check if a grade card already exists for this student and semester
            const existingGradeCard = await GradeCard.findOne({
                rollNumber: student.rollNumber,
                semester: student.semester
            });
            
            // Format subjects for database storage
            const formattedSubjects = subjects.map(subject => ({
                name: subject.name,
                semesterMarks: subject.semesterMarks,
                internalMarks: subject.internalMarks,
                practicalMarks: subject.practicalMarks,
                termworkMarks: subject.termworkMarks,
                totalMarks: subject.totalMarks,
                grade: subject.grade
            }));
            
            if (existingGradeCard) {
                // Update existing grade card
                existingGradeCard.subjects = formattedSubjects;
                existingGradeCard.sgpa = sgpa;
                existingGradeCard.result = result;
                existingGradeCard.generatedAt = new Date();
                await existingGradeCard.save();
                console.log('Grade card updated successfully');
            } else {
                // Create new grade card
                const newGradeCard = new GradeCard({
                    studentId: student._id,
                    rollNumber: student.rollNumber,
                    studentName: gradeCardData.student.name,
                    branch: student.branch,
                    semester: student.semester,
                    subjects: formattedSubjects,
                    sgpa: sgpa,
                    result: result,
                    academicYear: student.academicYear,
                    generatedBy: req.facultyId
                });
                
                await newGradeCard.save();
                console.log('New grade card saved successfully');
            }
            
            // Return grade card data to the client
            res.json(gradeCardData);
            
        } catch (dbError) {
            console.error('Error saving grade card to database:', dbError);
            // Still return the grade card data to the client even if saving fails
            res.json(gradeCardData);
        }
        
    } catch (error) {
        console.error('Error generating grade card:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all grade cards for a student
router.get('/gradecards/:rollNumber', verifyFacultyToken, async (req, res) => {
    try {
        const { rollNumber } = req.params;
        
        // Find all grade cards for the student
        const gradeCards = await GradeCard.find({ rollNumber })
            .sort({ semester: 1, generatedAt: -1 });
        
        if (!gradeCards || gradeCards.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No grade cards found for this student' 
            });
        }
        
        res.json({
            success: true,
            gradeCards
        });
        
    } catch (error) {
        console.error('Error retrieving grade cards:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get a specific grade card by ID
router.get('/gradecard/id/:id', verifyFacultyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find grade card by ID
        const gradeCard = await GradeCard.findById(id);
        
        if (!gradeCard) {
            return res.status(404).json({ 
                success: false, 
                message: 'Grade card not found' 
            });
        }
        
        res.json({
            success: true,
            gradeCard
        });
        
    } catch (error) {
        console.error('Error retrieving grade card:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update the results-analysis route
router.get('/results-analysis', verifyFacultyToken, async (req, res) => {
    try {
        const { semester, subject } = req.query;
        
        // Get faculty information to determine department
        const Faculty = req.app.locals.Faculty;
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: 'Faculty not found' 
            });
        }
        
        // Get faculty's department
        const facultyDepartment = faculty.professionalInfo.department;
        
        // Get corresponding branch
        const branchName = departmentToBranchMap[facultyDepartment];
        
        if (!branchName) {
            console.error('No branch mapping found for department:', facultyDepartment);
            return res.status(400).json({
                success: false,
                message: 'Invalid department mapping'
            });
        }
        
        // Find all grade cards matching the criteria
        let query = {};
        if (semester) query.semester = parseInt(semester);
        
        // Find students with matching branch first
        const students = await Student.find({ branch: branchName });
        const studentRollNumbers = students.map(student => student.rollNumber);
        
        // Add roll number filter to query
        query.rollNumber = { $in: studentRollNumbers };
        
        const gradeCards = await GradeCard.find(query)
            .sort({ rollNumber: 1 });
            
        if (!gradeCards || gradeCards.length === 0) {
            return res.json({
                success: false,
                message: 'No results found'
            });
        }

        // Filter by subject if specified
        let filteredGradeCards = gradeCards;
        if (subject) {
            filteredGradeCards = gradeCards.filter(card => 
                card.subjects.some(sub => sub.name === subject)
            );
            
            if (filteredGradeCards.length === 0) {
                return res.json({
                    success: false,
                    message: 'No results found for the selected subject'
                });
            }
        }

        // Calculate statistics
        const stats = {
            totalStudents: filteredGradeCards.length,
            passCount: filteredGradeCards.filter(card => card.result === 'PASS').length,
            failCount: filteredGradeCards.filter(card => card.result === 'FAIL').length,
            gradeDistribution: {
                A: 0, B: 0, C: 0, D: 0, E: 0, F: 0
            },
            averageSGPA: 0,
            subjectPerformance: {}
        };

        // Calculate grade distribution and average SGPA
        let totalSGPA = 0;
        filteredGradeCards.forEach(card => {
            totalSGPA += card.sgpa;
            
            if (subject) {
                // If subject is specified, only count grades for that subject
                const subjectData = card.subjects.find(sub => sub.name === subject);
                if (subjectData) {
                    stats.gradeDistribution[subjectData.grade]++;
                }
            } else {
                // Otherwise count all subjects and calculate subject performance
                card.subjects.forEach(sub => {
                    stats.gradeDistribution[sub.grade]++;
                    
                    // Initialize subject performance data if not exists
                    if (!stats.subjectPerformance[sub.name]) {
                        stats.subjectPerformance[sub.name] = {
                            totalMarks: 0,
                            count: 0,
                            passCount: 0,
                            failCount: 0,
                            average: 0,
                            passRate: 0
                        };
                    }
                    
                    // Update subject performance data
                    stats.subjectPerformance[sub.name].totalMarks += sub.totalMarks;
                    stats.subjectPerformance[sub.name].count++;
                    
                    if (sub.grade !== 'F') {
                        stats.subjectPerformance[sub.name].passCount++;
                    } else {
                        stats.subjectPerformance[sub.name].failCount++;
                    }
                });
            }
        });
        
        // Calculate averages and pass rates for each subject
        if (!subject) {
            Object.keys(stats.subjectPerformance).forEach(subName => {
                const subData = stats.subjectPerformance[subName];
                subData.average = subData.totalMarks / subData.count;
                subData.passRate = subData.passCount / subData.count;
            });
        }
        
        stats.averageSGPA = filteredGradeCards.length > 0 ? 
            (totalSGPA / filteredGradeCards.length).toFixed(2) : "0.00";

        res.json({
            success: true,
            stats,
            results: filteredGradeCards
        });
        
    } catch (error) {
        console.error('Error fetching results analysis:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Bulk upload marks endpoint
router.post('/marks/bulk', verifyFacultyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { semester, subject } = req.body;
        
        if (!semester || !subject) {
            return res.status(400).json({ success: false, message: 'Semester and subject are required' });
        }
        
        // Get faculty information
        const Faculty = req.app.locals.Faculty;
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }
        
        // Get faculty's department
        const facultyDepartment = faculty.professionalInfo.department;
        
        // Read the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        
        // Process each row
        const results = {
            total: data.length,
            successful: 0,
            failed: 0,
            records: []
        };
        
        for (const row of data) {
            try {
                // Extract data from row
                const seatNumber = row['Seat Number']?.toString();
                const studentName = row['Student Name'];
                const internalMarks = parseInt(row['Internal (25)'] || 0);
                const semesterMarks = parseInt(row['Semester (75)'] || 0);
                const practicalMarks = parseInt(row['Practical (25)'] || 0);
                const termWorkMarks = parseInt(row['Term Work (25)'] || 0);
                
                if (!seatNumber) {
                    throw new Error('Seat number is required');
                }
                
                // Validate marks
                if (internalMarks < 0 || internalMarks > 25) {
                    throw new Error('Internal marks must be between 0 and 25');
                }
                if (semesterMarks < 0 || semesterMarks > 75) {
                    throw new Error('Semester marks must be between 0 and 75');
                }
                if (practicalMarks < 0 || practicalMarks > 25) {
                    throw new Error('Practical marks must be between 0 and 25');
                }
                if (termWorkMarks < 0 || termWorkMarks > 25) {
                    throw new Error('Term work marks must be between 0 and 25');
                }
                
                // Find student by seat number
                const student = await Student.findOne({ rollNumber: seatNumber });
                
                if (!student) {
                    throw new Error('Student not found');
                }
                
                // Map student's branch to department
                const studentBranch = student.branch;
                const studentDepartment = branchToDepartmentMap[studentBranch] || studentBranch;
                
                // Check if faculty's department matches student's department
                if (facultyDepartment !== studentDepartment) {
                    throw new Error('You can only manage students from your department');
                }
                
                // Create marks object
                const marks = {
                    internal: internalMarks,
                    semester: semesterMarks,
                    practical: practicalMarks,
                    termwork: termWorkMarks
                };
                
                // Check if marks already exist for this student, subject, and semester
                let existingMarks = await Marks.findOne({ 
                    rollNumber: seatNumber, 
                    subject, 
                    semester 
                });
                
                if (existingMarks) {
                    // Update existing marks
                    existingMarks.marks = marks;
                    await existingMarks.save();
                } else {
                    // Create new marks record
                    const newMarks = new Marks({
                        studentId: student._id,
                        rollNumber: seatNumber,
                        subject,
                        semester,
                        marks,
                        facultyId: req.facultyId
                    });
                    
                    await newMarks.save();
                }
                
                // Record success
                results.successful++;
                results.records.push({
                    seatNumber,
                    studentName,
                    success: true,
                    message: 'Marks saved successfully'
                });
            } catch (error) {
                // Record failure
                results.failed++;
                results.records.push({
                    seatNumber: row['Seat Number']?.toString() || 'Unknown',
                    studentName: row['Student Name'] || 'Unknown',
                    success: false,
                    message: error.message
                });
            }
        }
        
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        
        // Return results
        res.json({
            success: true,
            message: 'Marks upload processed',
            results
        });
    } catch (error) {
        console.error('Error processing bulk marks upload:', error);
        
        // Delete the uploaded file if it exists
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// API to fetch all allocated classrooms for a particular faculty
router.get("/supervisor-allocations", verifyFacultyToken, async (req, res) => {
    try {
        // Get the faculty from the database using the ID from the token
        const { Faculty, SupervisorAllocation } = require('../models/Faculty');
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: "Faculty not found" 
            });
        }
        
        // Get the faculty's ID from personalInfo
        const supervisorId = faculty.personalInfo.ID;
        console.log("Fetching supervisor allocations for supervisor ID:", supervisorId);

        // Find allocations where supervisorId matches the faculty's ID
        const allocations = await SupervisorAllocation.find(
            { supervisorId: supervisorId },
            { classroom: 1, examDate: 1, examTime: 1, paper: 1 }
        );

        console.log("Found allocations:", allocations.length);

        res.json({ 
            success: true, 
            allocations: allocations || [] 
        });
    } catch (error) {
        console.error("Error fetching supervisor allocations:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Create a connection to the allocated classrooms database
const allocatedClassroomsConnection = mongoose.createConnection("mongodb://localhost:27017/allocated_classrooms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Allocated Classroom Schema
const allocatedClassroomSchema = new mongoose.Schema({
    hallTicketNumber: String,
    studentRollNo: String,
    studentName: String,
    branch: String,
    semester: Number,
    paper: {
        code: String,
        name: String
    },
    classroom: {
        building: String,
        room: String
    },
    benchNumber: {
        row: Number,
        column: Number,
        number: Number
    },
    examDate: Date,
    examTime: String,
    allocatedOn: {
        type: Date,
        default: Date.now
    }
});

// Create the model for the allocated classrooms collection
const AllocatedClassroom = allocatedClassroomsConnection.model('allocatedclassrooms', allocatedClassroomSchema);

// API to fetch students allocated to a specific classroom for a specific exam
router.post("/classroom-students", verifyFacultyToken, async (req, res) => {
    try {
        const { building, room, paperCode, examDate, examTime } = req.body;
        
        if (!building || !room) {
            return res.status(400).json({ 
                success: false, 
                message: "Building and room are required" 
            });
        }
        
        // Get the faculty from the database using the ID from the token
        const { Faculty } = require('../models/Faculty');
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: "Faculty not found" 
            });
        }
        
        // Get the faculty's ID from personalInfo
        const supervisorId = faculty.personalInfo.ID;
        
        // Build query to find students in this classroom
        const query = {
            'classroom.building': building,
            'classroom.room': room
        };
        
        // Add paper code to query if provided
        if (paperCode) {
            query['paper.code'] = paperCode;
        }
        
        // Add exam date to query if provided
        if (examDate) {
            // Create a date range for the given date (start of day to end of day)
            const startDate = new Date(examDate);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(examDate);
            endDate.setHours(23, 59, 59, 999);
            
            query.examDate = { $gte: startDate, $lte: endDate };
        }
        
        // Add exam time to query if provided
        if (examTime) {
            query.examTime = examTime;
        }
        
        console.log("Fetching students with query:", JSON.stringify(query));
        
        // Find students allocated to this classroom
        const students = await AllocatedClassroom.find(query)
            .sort({ 'benchNumber.number': 1 })
            .select({
                hallTicketNumber: 1,
                studentName: 1,
                branch: 1,
                semester: 1,
                benchNumber: 1
            });
        
        console.log(`Found ${students.length} students in classroom ${building}-${room}`);
        
        res.json({
            success: true,
            students: students || []
        });
    } catch (error) {
        console.error("Error fetching classroom students:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// API to save attendance for a classroom
router.post("/save-attendance", verifyFacultyToken, async (req, res) => {
    try {
        console.log("Received attendance data:", JSON.stringify(req.body, null, 2));
        
        const { classroom, paper, examDate, examTime, students } = req.body;
        
        if (!classroom || !paper || !examDate || !examTime || !students) {
            console.error("Missing required fields:", { classroom, paper, examDate, examTime, studentsLength: students?.length });
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }
        
        // Get the faculty from the database using the ID from the token
        const { Faculty } = require('../models/Faculty');
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            console.error("Faculty not found with ID:", req.facultyId);
            return res.status(404).json({ 
                success: false, 
                message: "Faculty not found" 
            });
        }
        
        // Get the faculty's ID from personalInfo
        const supervisorId = faculty.personalInfo.ID;
        console.log("Supervisor ID:", supervisorId);
        
        // Format the date properly
        const formattedDate = new Date(examDate);
        
        // Check if attendance record already exists
        let attendanceRecord = await Attendance.findOne({
            'classroom.building': classroom.building,
            'classroom.room': classroom.room,
            'paperCode': paper.code,
            examDate: {
                $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
                $lte: new Date(formattedDate.setHours(23, 59, 59, 999))
            },
            examTime: examTime,
            supervisorId: supervisorId
        });
        
        console.log("Existing attendance record found:", !!attendanceRecord);
        
        if (attendanceRecord) {
            // Update existing record
            attendanceRecord.students = students.map(student => ({
                hallTicketNumber: student.hallTicketNumber,
                studentName: student.studentName || "",
                isPresent: student.isPresent,
                markedAt: new Date()
            }));
            
            attendanceRecord.updatedAt = new Date();
            
            try {
                await attendanceRecord.save();
                console.log("Attendance record updated successfully");
            } catch (saveError) {
                console.error("Error updating attendance record:", saveError);
                throw new Error(`Failed to update attendance: ${saveError.message}`);
            }
            
            return res.json({
                success: true,
                message: "Attendance updated successfully",
                attendance: attendanceRecord
            });
        }
        
        // Create new attendance record
        const newAttendance = new Attendance({
            examDate: formattedDate,
            examTime: examTime,
            paperCode: paper.code,
            paperName: paper.name,
            classroom: {
                building: classroom.building,
                room: classroom.room
            },
            supervisorId: supervisorId,
            students: students.map(student => ({
                hallTicketNumber: student.hallTicketNumber,
                studentName: student.studentName || "",
                isPresent: student.isPresent,
                markedAt: new Date()
            }))
        });
        
        try {
            await newAttendance.save();
            console.log("New attendance record saved successfully");
        } catch (saveError) {
            console.error("Error saving new attendance record:", saveError);
            throw new Error(`Failed to save attendance: ${saveError.message}`);
        }
        
        res.json({
            success: true,
            message: "Attendance saved successfully",
            attendance: newAttendance
        });
    } catch (error) {
        console.error("Error in save-attendance route:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error: " + error.message 
        });
    }
});

// API to get attendance for a classroom
router.post("/get-attendance", verifyFacultyToken, async (req, res) => {
    try {
        const { building, room, paperCode, examDate, examTime } = req.body;
        
        if (!building || !room || !paperCode || !examDate || !examTime) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }
        
        // Get the faculty from the database using the ID from the token
        const { Faculty } = require('../models/Faculty');
        const faculty = await Faculty.findById(req.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false, 
                message: "Faculty not found" 
            });
        }
        
        // Get the faculty's ID from personalInfo
        const supervisorId = faculty.personalInfo.ID;
        
        // Format the date properly
        const formattedDate = new Date(examDate);
        const startDate = new Date(formattedDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(formattedDate);
        endDate.setHours(23, 59, 59, 999);
        
        console.log("Looking for attendance with params:", {
            building,
            room,
            paperCode,
            examDate: `${startDate.toISOString()} to ${endDate.toISOString()}`,
            examTime,
            supervisorId
        });
        
        // Find attendance record
        const attendanceRecord = await Attendance.findOne({
            'classroom.building': building,
            'classroom.room': room,
            'paperCode': paperCode,
            examDate: { $gte: startDate, $lte: endDate },
            examTime: examTime,
            supervisorId: supervisorId
        });
        
        console.log("Found attendance record:", !!attendanceRecord);
        
        if (!attendanceRecord) {
            return res.json({
                success: true,
                message: "No attendance record found",
                attendance: null
            });
        }
        
        res.json({
            success: true,
            attendance: attendanceRecord
        });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router; 