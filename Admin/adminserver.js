const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Student Schema
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
                'MECHANICAL', 
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

// Create the Student model
const Student = mongoose.model('students', studentSchema);

// Faculty Schema
const facultySchema = new mongoose.Schema({
    personalInfo: {
        name: String,
        age: Number,
        gender: String,
        contact: String,
        email: String,
        address: String,
        username: String,
        password: String,
        ID: String
    },
    professionalInfo: {
        designation: String,
        department: String,
        experience: Number,
        specialization: String,
        status: String,
        allocatedclass: {
            type: String,
            default: "None"
        }
    }
});

// Create Faculty model with explicit connection
const facultyConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/FacultyDB');
const Faculty = facultyConnection.model('Faculty', facultySchema);

// Define the SupervisorAllocation Schema
const supervisorAllocationSchema = new mongoose.Schema({
    supervisorId: String,
    supervisorName: String,
    department: String,
    classroom: {
        building: String,
        room: String
    },
    examDate: Date,
    examTime: String,
    paper: {
        code: String,
        name: String
    },
    allocatedOn: Date
});

// Create the model
const SupervisorAllocation = mongoose.model('SupervisorAllocation', supervisorAllocationSchema);

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/exam_central', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully!');
        
        // Only start the server after successful database connection
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`🚀 Admin server is running on port ${PORT}`);
        });

        // Add this after your admin server is successfully started
        if (process.send) {
            process.send('admin-server-ready');
        }

    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

// Define routes
// Student Authentication Route - Primary route for login
app.post('/api/student/auth', async (req, res) => {
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
app.get('/api/students', async (req, res) => {
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
app.post('/api/students', async (req, res) => {
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

        const student = new Student(req.body);
        const newStudent = await student.save();
        console.log('✅ Student added successfully:', newStudent.rollNumber);
        res.status(201).json(newStudent);
    } catch (error) {
        console.error('❌ Error adding student:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({
                message: `Duplicate ${field}. This ${field} already exists.`,
                error: error.message
            });
        } else {
            res.status(400).json({ 
                message: 'Error adding student',
                error: error.message 
            });
        }
    }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        console.log(`📥 Updating student ${req.params.id}:`, req.body);
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log('✅ Student updated successfully');
        res.json(student);
    } catch (error) {
        console.error('❌ Error updating student:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({
                message: `Duplicate ${field}. This ${field} already exists.`,
                error: error.message
            });
        } else {
            res.status(400).json({ 
                message: 'Error updating student',
                error: error.message 
            });
        }
    }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
    try {
        console.log(`📥 Deleting student ${req.params.id}`);
        const student = await Student.findByIdAndDelete(req.params.id);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log('✅ Student deleted successfully');
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting student:', error);
        res.status(500).json({ 
            message: 'Error deleting student',
            error: error.message 
        });
    }
});

// Search students
app.get('/api/students/search', async (req, res) => {
    const searchTerm = req.query.term;
    try {
        console.log(`📥 Searching for term: ${searchTerm}`);
        const students = await Student.find({
            $or: [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { rollNumber: { $regex: searchTerm, $options: 'i' } },
                { branch: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        }).limit(20);
        console.log(`✅ Found ${students.length} matching students`);
        res.json(students);
    } catch (error) {
        console.error('❌ Error searching students:', error);
        res.status(500).json({ 
            message: 'Error searching students',
            error: error.message 
        });
    }
});

// Get analytics data
app.get('/api/students/analytics', async (req, res) => {
    try {
        console.log('📥 Fetching analytics data');
        const branchDistribution = await Student.aggregate([
            { $group: { _id: '$branch', count: { $sum: 1 } } }
        ]);

        const semesterDistribution = await Student.aggregate([
            { $group: { _id: '$semester', count: { $sum: 1 } } }
        ]);

        const yearlyEnrollment = await Student.aggregate([
            { $group: { _id: '$academicYear', count: { $sum: 1 } } }
        ]);

        console.log('✅ Analytics data fetched successfully');
        res.json({
            branchDistribution,
            semesterDistribution,
            yearlyEnrollment
        });
    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        res.status(500).json({ 
            message: 'Error fetching analytics',
            error: error.message 
        });
    }
});

// Get Student Profile Route
app.get('/api/student/profile/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;
        
        // Find student by roll number
        const student = await Student.findOne({ rollNumber });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Return student data
        res.json({
            success: true,
            student
        });
    } catch (error) {
        console.error('❌ Error fetching student profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student profile',
            error: error.message
        });
    }
});

// Get all hall tickets
app.get('/api/hall-tickets', async (req, res) => {
    try {
        console.log('📥 Received request for hall tickets list');
        
        // Connect to the exam database to fetch hall tickets
        const examDbConnection = mongoose.createConnection("mongodb://localhost:27017/exam_hall_tickets", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Define the Hall Ticket schema for this connection
        const hallTicketSchema = new mongoose.Schema({
            hallTicketNumber: String,
            studentRollNo: String,
            firstName: String,
            middleName: String,
            lastName: String,
            branch: String,
            semester: Number,
            examination: String,
            subjects: [{
                code: String,
                name: String
            }],
            generatedDate: Date,
            isActive: Boolean
        });
        
        // Create the model
        const HallTicket = examDbConnection.model('HallTicket', hallTicketSchema, 'hall_tickets');
        
        // Apply filters if provided
        const filter = {};
        if (req.query.branch) filter.branch = req.query.branch;
        if (req.query.semester) filter.semester = parseInt(req.query.semester);
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Get total count and fetch hall tickets
        const total = await HallTicket.countDocuments(filter);
        const hallTickets = await HallTicket.find(filter)
            .sort({ generatedDate: -1 })
            .skip(skip)
            .limit(limit);
            
        console.log(`✅ Found ${hallTickets.length} hall tickets`);
        
        // Close the connection after use
        await examDbConnection.close();
        
        res.json({
            hallTickets,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalHallTickets: total
        });
    } catch (error) {
        console.error('❌ Error fetching hall tickets:', error);
        res.status(500).json({ 
            message: 'Error fetching hall tickets',
            error: error.message 
        });
    }
});
// Create a separate Mongoose connection for 'allocated_classrooms' database
const allocatedClassroomsConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Mongoose Schema
const seatingSchema = new mongoose.Schema({
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
    allocatedOn: Date
}, { collection: 'allocatedclassrooms' });

// Create Model using the specific connection
const Seating = allocatedClassroomsConnection.model('Seating', seatingSchema);

// API Route to Get Seating Arrangement by Classroom and Paper Name
app.get('/api/seating-arrangement', async (req, res) => {
    try {
        const { classroom, paperCode } = req.query;

        if (!classroom || !paperCode) {
            return res.status(400).json({ message: '❌ Classroom and Paper Name are required.' });
        }

        const query = {
            'classroom.room': classroom,
            'paper.code': paperCode
        };

        const seatingData = await Seating.find(query);

        if (seatingData.length === 0) {
            return res.status(404).json({ message: 'ℹ️ No seating arrangement found for the selected filters.' });
        }

        res.json(seatingData);
    } catch (error) {
        console.error('❌ Error fetching data:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get all faculty members with pagination
app.get('/api/faculty', async (req, res) => {
    try {
        console.log('📥 Fetching all faculty members');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Add filter for department if provided
        const filter = {};
        if (req.query.department) {
            filter.department = req.query.department;
        }

        const total = await Faculty.countDocuments(filter);
        const faculty = await Faculty.find(filter)
            .sort({ ID: 1 })
            .skip(skip)
            .limit(limit);

        console.log(`✅ Found ${faculty.length} faculty members`);
        
        res.json({
            faculty,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalFaculty: total
        });
    } catch (error) {
        console.error('❌ Error fetching faculty:', error);
        res.status(500).json({
            message: 'Error fetching faculty members',
            error: error.message
        });
    }
});

// Add new faculty member with validation
app.post('/api/faculty', async (req, res) => {
    try {
        console.log('📥 Received new faculty data:', req.body);

        // Validate required fields
        const requiredFields = ['ID', 'name', 'department', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            console.log('❌ Missing required fields:', missingFields);
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields
            });
        }

        const faculty = new Faculty(req.body);
        const newFaculty = await faculty.save();
        console.log('✅ Faculty member added successfully:', newFaculty.ID);
        res.status(201).json(newFaculty);
    } catch (error) {
        console.error('❌ Error adding faculty:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({
                message: `Duplicate ${field}. This ${field} already exists.`,
                error: error.message
            });
        } else {
            res.status(400).json({
                message: 'Error adding faculty member',
                error: error.message
            });
        }
    }
});

// Add route to get faculty by ID
app.get('/api/faculty/:id', async (req, res) => {
    try {
        console.log(`📥 Fetching faculty member with ID: ${req.params.id}`);
        const faculty = await Faculty.findOne({ ID: req.params.id });
        
        if (!faculty) {
            console.log('❌ Faculty member not found');
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        console.log('✅ Faculty member found:', faculty.ID);
        res.json(faculty);
    } catch (error) {
        console.error('❌ Error fetching faculty member:', error);
        res.status(500).json({
            message: 'Error fetching faculty member',
            error: error.message
        });
    }
});

// Add route to delete faculty
app.delete('/api/faculty/:id', async (req, res) => {
    try {
        console.log(`📥 Deleting faculty member with ID: ${req.params.id}`);
        const faculty = await Faculty.findOneAndDelete({ ID: req.params.id });
        
        if (!faculty) {
            console.log('❌ Faculty member not found');
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        console.log('✅ Faculty member deleted successfully');
        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting faculty member:', error);
        res.status(500).json({
            message: 'Error deleting faculty member',
            error: error.message
        });
    }
});

// Add route to update faculty availability
app.patch('/api/faculty/:id/availability', async (req, res) => {
    try {
        console.log(`📝 Updating availability for faculty ID: ${req.params.id}`);
        const { status, resetAllocation } = req.body;
        
        if (!status || !['Active', 'Unavailable'].includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status value. Must be "Active" or "Unavailable"' 
            });
        }
        
        const faculty = await Faculty.findOne({ "personalInfo.ID": req.params.id });
        
        if (!faculty) {
            console.log('❌ Faculty member not found');
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        // Update object to modify faculty document
        const updateObj = {
            "professionalInfo.status": status
        };

        // If marking as unavailable, reset the allocated class
        if (resetAllocation) {
            updateObj["professionalInfo.allocatedclass"] = "None";
            
            // Also remove from supervisor allocations collection if it exists
            await SupervisorAllocation.deleteMany({ supervisorId: req.params.id });
        }
        
        // Update faculty document
        await Faculty.updateOne(
            { "personalInfo.ID": req.params.id },
            { $set: updateObj }
        );
        
        console.log(`✅ Faculty availability updated to: ${status}`);
        res.json({ 
            message: `Faculty availability updated to ${status}`,
            faculty: {
                ID: faculty.personalInfo.ID,
                status: status,
                allocatedclass: resetAllocation ? "None" : faculty.professionalInfo.allocatedclass
            }
        });
    } catch (error) {
        console.error('❌ Error updating faculty availability:', error);
        res.status(500).json({
            message: 'Error updating faculty availability',
            error: error.message
        });
    }
});

// Improved endpoint to fetch supervisor allocations with better debugging
app.get('/api/supervisor-allocations', async (req, res) => {
    try {
        console.log('Fetching supervisor allocations...');
        
        // Connect to FacultyDB
        const facultyDB = mongoose.connection.useDb('FacultyDB');
        
        // Define the schema if it doesn't exist
        let SupervisorAllocation;
        try {
            SupervisorAllocation = facultyDB.model('SupervisorAllocation');
            console.log('Using existing SupervisorAllocation model');
        } catch (e) {
            console.log('Creating new SupervisorAllocation model');
            const supervisorAllocationSchema = new mongoose.Schema({
                supervisorId: String,
                supervisorName: String,
                department: String,
                classroom: {
                    building: String,
                    room: String
                },
                examDate: Date,
                examTime: String,
                paper: {
                    code: String,
                    name: String
                },
                allocatedOn: {
                    type: Date,
                    default: Date.now
                }
            }, { collection: 'supervisorallocations' });
            
            SupervisorAllocation = facultyDB.model('SupervisorAllocation', supervisorAllocationSchema);
        }
        
        // Fetch all allocations
        console.log('Querying database for allocations...');
        const allocations = await SupervisorAllocation.find({});
        console.log(`Found ${allocations.length} supervisor allocations`);
        
        // Log the raw allocations for debugging
        console.log('Raw allocations:', JSON.stringify(allocations.slice(0, 2)));
        
        // Format the allocations for the frontend
        const formattedAllocations = allocations.map(allocation => {
            // Create a safe object with default values
            return {
                classroom: allocation.classroom ? 
                    `${allocation.classroom.building || ''}-${allocation.classroom.room || ''}` : 'N/A',
                supervisorName: allocation.supervisorName || 'N/A',
                department: allocation.department || 'N/A',
                examDate: allocation.examDate || null,
                examTime: allocation.examTime || 'N/A',
                paper: allocation.paper ? 
                    `${allocation.paper.code || ''} - ${allocation.paper.name || ''}` : 'N/A'
            };
        });
        
        console.log(`Formatted ${formattedAllocations.length} allocations`);
        console.log('Sample formatted allocation:', formattedAllocations.length > 0 ? JSON.stringify(formattedAllocations[0]) : 'None');
        
        res.json({
            success: true,
            allocations: formattedAllocations
        });
        
    } catch (error) {
        console.error('Error fetching supervisor allocations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch supervisor allocations',
            error: error.message
        });
    }
});

// Update the POST endpoint for supervisor allocation
app.post('/api/allocate-supervisors', async (req, res) => {
    try {
        console.log('Starting supervisor allocation process...');

        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Create a model for supervisor allocations in FacultyDB
        const facultyDB = mongoose.connection.useDb('FacultyDB');
        const SupervisorAllocation = facultyDB.model('SupervisorAllocation', supervisorAllocationSchema);

        // Get unique classroom allocations
        const uniqueAllocations = await AllocatedClassroom.aggregate([
            {
                $group: {
                    _id: {
                        room: "$classroom.room",
                        building: "$classroom.building",
                        examDate: "$examDate",
                        examTime: "$examTime",
                        paperCode: "$paper.code",
                        paperName: "$paper.name"
                    }
                }
            }
        ]);

        if (uniqueAllocations.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No classrooms allocated yet"
            });
        }

        // Get available supervisors
        const availableSupervisors = await Faculty.find({
            "professionalInfo.status": "Active",
            "professionalInfo.allocatedclass": "None"
        });

        if (availableSupervisors.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No available supervisors found"
            });
        }

        const allocations = [];
        let supervisorIndex = 0;
        
        // Clear previous allocations
        await SupervisorAllocation.deleteMany({});

        // Allocate supervisors to classrooms
        for (const allocation of uniqueAllocations) {
            if (supervisorIndex >= availableSupervisors.length) {
                supervisorIndex = 0;
            }

            const supervisor = availableSupervisors[supervisorIndex];
            const classroomString = `${allocation._id.building}-${allocation._id.room}`;
            
            // Create allocation object
            const newAllocation = new SupervisorAllocation({
                supervisorId: supervisor.personalInfo.ID,
                supervisorName: supervisor.personalInfo.name,
                department: supervisor.professionalInfo.department,
                classroom: {
                    building: allocation._id.building,
                    room: allocation._id.room
                },
                examDate: allocation._id.examDate,
                examTime: allocation._id.examTime,
                paper: {
                    code: allocation._id.paperCode,
                    name: allocation._id.paperName
                },
                allocatedOn: new Date()
            });
            
            // Save to database
            await newAllocation.save();
            
            // Update faculty's allocated classroom
            await Faculty.updateOne(
                { "personalInfo.ID": supervisor.personalInfo.ID },
                { $set: { "professionalInfo.allocatedclass": classroomString } }
            );

            allocations.push({
                classroom: classroomString,
                supervisor: supervisor.personalInfo.name,
                department: supervisor.professionalInfo.department,
                examDate: allocation._id.examDate,
                examTime: allocation._id.examTime,
                paper: allocation._id.paperName
            });

            supervisorIndex++;
        }

        await allocatedClassroomsDB.close();

        res.json({
            success: true,
            message: `Successfully allocated ${allocations.length} supervisors`,
            allocations: allocations
        });

    } catch (error) {
        console.error('Error in supervisor allocation:', error);
        res.status(500).json({
            success: false,
            message: "Failed to allocate supervisors",
            error: error.message
        });
    }
});

// Connect to database
connectDB();

app.post('/api/faculty/assign-classroom', async (req, res) => {
    try {
        const { facultyId, classroom } = req.body;
        
        if (!facultyId || !classroom) {
            return res.status(400).json({
                success: false,
                message: 'Faculty ID and classroom are required'
            });
        }
        
        // Find the faculty
        const faculty = await Faculty.findOne({ 'personalInfo.ID': facultyId });
        
        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }
        
        // Update the faculty's allocated classroom
        await Faculty.updateOne(
            { 'personalInfo.ID': facultyId },
            { $set: { 'professionalInfo.allocatedclass': classroom } }
        );
        
        // Verify the update
        const updatedFaculty = await Faculty.findOne({ 'personalInfo.ID': facultyId });
        
        res.json({
            success: true,
            message: 'Faculty assigned to classroom successfully',
            faculty: {
                id: updatedFaculty._id,
                name: updatedFaculty.personalInfo.name,
                allocatedClass: updatedFaculty.professionalInfo.allocatedclass
            }
        });
    } catch (error) {
        console.error('Error assigning faculty to classroom:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign faculty to classroom',
            error: error.message
        });
    }
});

// Add this endpoint to get classroom allocations
app.get('/api/classroom-allocations', async (req, res) => {
    try {
        const { classroom, paper } = req.query;
        
        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Build query based on filters
        const query = {};
        if (classroom) query['classroom.room'] = classroom;
        if (paper) query['paper.code'] = paper;
        
        // Get all classroom allocations with filters
        const allocations = await AllocatedClassroom.find(query)
            .sort({ examDate: 1, examTime: 1 });
        
        await allocatedClassroomsDB.close();
        
        res.json({
            success: true,
            allocations: allocations
        });
    } catch (error) {
        console.error('Error fetching classroom allocations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch classroom allocations',
            error: error.message
        });
    }
});

// Use a different variable name like:
const routerStack = app._router.stack;

// Or if you're trying to debug routes, you could use:
// console.log('Routes:', app._router.stack.filter(r => r.route).map(r => r.route.path));

// Define the route if it doesn't exist
if (!routerStack.some(r => r.route && r.route.path === '/api/faculty/assigned/:classroom/:paperCode?')) {
  app.get('/api/faculty/assigned/:classroom/:paperCode?', async (req, res) => {
    try {
      const { classroom, paperCode } = req.params;
      console.log(`Looking for faculty assigned to classroom: ${classroom}, paper code: ${paperCode || 'Not specified'}`);
      
      // Parse classroom to get building and room
      let building = '';
      let room = classroom;
      
      // Check if classroom has building-room format
      if (classroom.includes('-')) {
        const parts = classroom.split('-');
        building = parts[0];
        room = parts[1];
      }
      
      console.log(`Parsed classroom: Building=${building}, Room=${room}`);
      
      // Connect to the FacultyDB to access supervisorallocations collection
      const facultyDB = mongoose.connection.useDb('FacultyDB');
      
      // Define the SupervisorAllocation model if it doesn't exist
      let SupervisorAllocation;
      if (!facultyDB.models.SupervisorAllocation) {
        const supervisorAllocationSchema = new mongoose.Schema({
          supervisorId: String,
          supervisorName: String,
          department: String,
          classroom: {
            building: String,
            room: String
          },
          examDate: Date,
          examTime: String,
          paper: {
            code: String,
            name: String
          },
          allocatedOn: Date
        });
        
        SupervisorAllocation = facultyDB.model('SupervisorAllocation', supervisorAllocationSchema);
      } else {
        SupervisorAllocation = facultyDB.models.SupervisorAllocation;
      }
      
      // Build the query based on available parameters
      const query = {
        'classroom.room': room
      };
      
      // Add building to query if available
      if (building) {
        query['classroom.building'] = building;
      }
      
      // Add paper code to query if available
      if (paperCode) {
        query['paper.code'] = paperCode;
      }
      
      console.log('Query:', JSON.stringify(query));
      
      // Find the allocation
      const allocation = await SupervisorAllocation.findOne(query);
      
      console.log('Allocation found:', allocation ? 'Yes' : 'No');
      
      if (allocation) {
        console.log('Allocation details:', {
          supervisorId: allocation.supervisorId,
          supervisorName: allocation.supervisorName,
          classroom: `${allocation.classroom.building}-${allocation.classroom.room}`,
          paperCode: allocation.paper.code,
          paperName: allocation.paper.name
        });
        
        // Return the faculty information directly from the allocation
        res.json({
          success: true,
          faculty: {
            personalInfo: {
              ID: allocation.supervisorId,
              name: allocation.supervisorName
            },
            professionalInfo: {
              department: allocation.department,
              allocatedclass: `${allocation.classroom.building}-${allocation.classroom.room}`
            },
            paper: allocation.paper
          }
        });
      } else {
        // If no allocation found with paper code, try without paper code
        if (paperCode) {
          console.log('No allocation found with paper code. Trying without paper code...');
          const queryWithoutPaper = {
            'classroom.room': room
          };
          
          if (building) {
            queryWithoutPaper['classroom.building'] = building;
          }
          
          const allocationWithoutPaper = await SupervisorAllocation.findOne(queryWithoutPaper);
          
          if (allocationWithoutPaper) {
            console.log('Allocation found without paper code:', {
              supervisorId: allocationWithoutPaper.supervisorId,
              supervisorName: allocationWithoutPaper.supervisorName,
              classroom: `${allocationWithoutPaper.classroom.building}-${allocationWithoutPaper.classroom.room}`
            });
            
            res.json({
              success: true,
              faculty: {
                personalInfo: {
                  ID: allocationWithoutPaper.supervisorId,
                  name: allocationWithoutPaper.supervisorName
                },
                professionalInfo: {
                  department: allocationWithoutPaper.department,
                  allocatedclass: `${allocationWithoutPaper.classroom.building}-${allocationWithoutPaper.classroom.room}`
                },
                paper: allocationWithoutPaper.paper
              }
            });
            return;
          }
        }
        
        // If still not found, check if any faculty has this classroom assigned
        const faculty = await Faculty.findOne({
          'professionalInfo.allocatedclass': classroom
        });
        
        if (faculty) {
          console.log('Faculty found with allocated classroom:', {
            id: faculty._id,
            name: faculty.personalInfo?.name || 'Name not available'
          });
          
          res.json({
            success: true,
            faculty: faculty
          });
        } else {
          console.log('No faculty or allocation found for this classroom');
          res.json({
            success: false,
            message: 'No faculty assigned to this classroom',
            faculty: null
          });
        }
      }
    } catch (error) {
      console.error('Error fetching assigned faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assigned faculty',
        error: error.message
      });
    }
  });
  
  console.log('Added route: /api/faculty/assigned/:classroom/:paperCode?');
}

// Add this debugging endpoint to check classroom format
app.get('/api/debug/faculty-allocations', async (req, res) => {
    try {
        // Find all faculty with allocated classrooms
        const facultyWithAllocations = await Faculty.find({
            'professionalInfo.allocatedclass': { $exists: true, $ne: null }
        });
        
        // Log what we found
        console.log(`Found ${facultyWithAllocations.length} faculty with allocations`);
        
        // Create a list of allocations for debugging
        const allocations = facultyWithAllocations.map(faculty => ({
            facultyId: faculty._id,
            facultyName: faculty.personalInfo?.name || 'Unknown',
            allocatedClass: faculty.professionalInfo?.allocatedclass || 'None'
        }));
        
        res.json({
            success: true,
            count: allocations.length,
            allocations: allocations
        });
    } catch (error) {
        console.error('Error debugging faculty allocations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to debug faculty allocations',
            error: error.message
        });
    }
});

// Add this new endpoint after other routes
// Add this route to handle resetting supervisor allocations
app.post('/api/reset-supervisor-availability', async (req, res) => {
    try {
        console.log('Received request to reset all supervisor allocations');
        
        // 1. First, update all faculty members to set status to Unavailable and allocatedclass to None
        const facultyUpdateResult = await Faculty.updateMany(
            {}, // Update all faculty members
            { 
                $set: { 
                    'professionalInfo.status': 'Unavailable',
                    'professionalInfo.allocatedclass': 'None'
                } 
            }
        );
        
        console.log('Updated faculty members:', facultyUpdateResult.modifiedCount);
        
        // 2. Delete all supervisor allocations from the database
        // Connect to FacultyDB to access supervisorallocations collection
        const facultyDB = mongoose.connection.useDb('FacultyDB');
        
        // Define the SupervisorAllocation model if it doesn't exist
        let SupervisorAllocation;
        if (!facultyDB.models.SupervisorAllocation) {
            const supervisorAllocationSchema = new mongoose.Schema({
                supervisorId: String,
                supervisorName: String,
                department: String,
                classroom: {
                    building: String,
                    room: String
                },
                examDate: Date,
                examTime: String,
                paper: {
                    code: String,
                    name: String
                },
                allocatedOn: Date
            });
            
            SupervisorAllocation = facultyDB.model('SupervisorAllocation', supervisorAllocationSchema);
        } else {
            SupervisorAllocation = facultyDB.models.SupervisorAllocation;
        }
        
        const deleteResult = await SupervisorAllocation.deleteMany({});
        
        console.log('Deleted supervisor allocations:', deleteResult.deletedCount);
        
        res.json({
            success: true,
            message: 'All supervisor allocations have been reset',
            updatedCount: facultyUpdateResult.modifiedCount,
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Error resetting supervisor allocations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset supervisor allocations',
            error: error.message
        });
    }
});
// Keep existing endpoints... 
// Add this after your other imports
const { MongoClient, ObjectId } = require('mongodb');

// Add this after your other connections
// Create connection to GradeCardDB
const gradeCardDbConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/GradeCardDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

gradeCardDbConnection.on('connected', () => {
    console.log('✅ Connected to GradeCardDB for admin routes');
});

gradeCardDbConnection.on('error', (err) => {
    console.error('❌ GradeCardDB Connection Error:', err);
});

// Define GradeCard schema and model
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
    generatedByName: String,
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index for faster lookups
gradeCardSchema.index({ rollNumber: 1, semester: 1 });
gradeCardSchema.index({ branch: 1, semester: 1 });
gradeCardSchema.index({ studentName: 'text', rollNumber: 'text' });

const GradeCard = gradeCardDbConnection.model('GradeCard', gradeCardSchema);

// Add these routes after your other routes

// Get all grade cards with filtering and pagination
app.get('/api/grade-cards', async (req, res) => {
    try {
        const { branch, semester, year, search, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build query
        const query = {};
        if (branch) query.branch = branch;
        if (semester) query.semester = parseInt(semester);
        if (year) query.academicYear = parseInt(year);
        
        // Add text search if provided
        if (search) {
            query.$or = [
                { rollNumber: { $regex: search, $options: 'i' } },
                { studentName: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get total count for pagination
        const totalCount = await GradeCard.countDocuments(query);
        const totalPages = Math.ceil(totalCount / parseInt(limit));
        
        // Get grade cards with pagination
        const gradeCards = await GradeCard.find(query)
            .sort({ generatedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Calculate statistics
        const passCount = await GradeCard.countDocuments({
            ...query,
            result: 'PASS'
        });
        
        const passPercentage = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;
        
        // Calculate average SGPA
        const sgpaResult = await GradeCard.aggregate([
            { $match: query },
            { $group: { _id: null, averageSGPA: { $avg: '$sgpa' } } }
        ]);
        
        const averageSGPA = sgpaResult.length > 0 ? sgpaResult[0].averageSGPA : 0;
        
        res.json({
            success: true,
            gradeCards,
            totalCount,
            totalPages,
            currentPage: parseInt(page),
            passPercentage,
            averageSGPA
        });
        
    } catch (error) {
        console.error('Error fetching grade cards:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch grade cards',
            error: error.message
        });
    }
});

// Get a specific grade card by ID
app.get('/api/grade-cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the grade card
        const gradeCard = await GradeCard.findById(id);
        
        if (!gradeCard) {
            return res.status(404).json({
                success: false,
                message: 'Grade card not found'
            });
        }
        
        // Try to get faculty name if possible
        try {
            const faculty = await Faculty.findById(gradeCard.generatedBy);
            if (faculty && faculty.personalInfo && faculty.personalInfo.name) {
                gradeCard.generatedByName = faculty.personalInfo.name;
            }
        } catch (err) {
            console.log('Could not fetch faculty details:', err);
            // Continue without faculty name
        }
        
        res.json({
            success: true,
            gradeCard
        });
        
    } catch (error) {
        console.error('Error fetching grade card:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch grade card',
            error: error.message
        });
    }
});

// Get grade card statistics
app.get('/api/grade-cards-stats', async (req, res) => {
    try {
        // Get total count
        const totalCount = await GradeCard.countDocuments();
        
        // Get pass count
        const passCount = await GradeCard.countDocuments({ result: 'PASS' });
        
        // Calculate pass percentage
        const passPercentage = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;
        
        // Get average SGPA
        const sgpaResult = await GradeCard.aggregate([
            { $group: { _id: null, averageSGPA: { $avg: '$sgpa' } } }
        ]);
        
        const averageSGPA = sgpaResult.length > 0 ? sgpaResult[0].averageSGPA : 0;
        
        // Get branch distribution
        const branchDistribution = await GradeCard.aggregate([
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Get semester distribution
        const semesterDistribution = await GradeCard.aggregate([
            { $group: { _id: '$semester', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        // Get result distribution
        const resultDistribution = await GradeCard.aggregate([
            { $group: { _id: '$result', count: { $sum: 1 } } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalCount,
                passCount,
                passPercentage,
                averageSGPA,
                branchDistribution,
                semesterDistribution,
                resultDistribution
            }
        });
        
    } catch (error) {
        console.error('Error fetching grade card statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch grade card statistics',
            error: error.message
        });
    }
});

// Delete a grade card (admin only)
app.delete('/api/grade-cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete the grade card
        const result = await GradeCard.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Grade card not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Grade card deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting grade card:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete grade card',
            error: error.message
        });
    }
});

// Add endpoint to reset all classroom allocations
app.post('/api/reset-classroom-allocations', async (req, res) => {
    try {
        console.log('Received request to reset all classroom allocations');
        
        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Delete all classroom allocations
        const deleteResult = await AllocatedClassroom.deleteMany({});
        
        console.log('Deleted classroom allocations:', deleteResult.deletedCount);
        
        res.json({
            success: true,
            message: 'All classroom allocations have been reset',
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Error resetting classroom allocations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset classroom allocations',
            error: error.message
        });
    }
});

// Add endpoint to get available classrooms with scheduled exams
app.get('/api/available-classrooms', async (req, res) => {
    try {
        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Get distinct classrooms where exams are scheduled
        const classrooms = await AllocatedClassroom.aggregate([
            { 
                $group: { 
                    _id: { 
                        building: "$classroom.building", 
                        room: "$classroom.room" 
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    building: "$_id.building",
                    room: "$_id.room"
                }
            },
            { $sort: { building: 1, room: 1 } }
        ]);
        
        await allocatedClassroomsDB.close();
        
        res.json({
            success: true,
            classrooms: classrooms
        });
    } catch (error) {
        console.error('Error fetching available classrooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available classrooms',
            error: error.message
        });
    }
});

// Add endpoint to get available papers for scheduled exams
app.get('/api/available-papers', async (req, res) => {
    try {
        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Get distinct papers where exams are scheduled
        const papers = await AllocatedClassroom.aggregate([
            { 
                $group: { 
                    _id: { 
                        code: "$paper.code", 
                        name: "$paper.name" 
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    code: "$_id.code",
                    name: "$_id.name"
                }
            },
            { $sort: { code: 1 } }
        ]);
        
        await allocatedClassroomsDB.close();
        
        res.json({
            success: true,
            papers: papers
        });
    } catch (error) {
        console.error('Error fetching available papers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available papers',
            error: error.message
        });
    }
});

// Add endpoint to get details for a specific classroom
app.get('/api/classroom-details', async (req, res) => {
    try {
        const { room } = req.query;
        
        if (!room) {
            return res.status(400).json({
                success: false,
                message: 'Room number is required'
            });
        }
        
        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Get all allocations for this room
        const allocations = await AllocatedClassroom.find({ 'classroom.room': room });
        
        if (allocations.length === 0) {
            await allocatedClassroomsDB.close();
            return res.json({
                success: true,
                details: {
                    room,
                    studentCount: 0,
                    totalSeats: 0
                }
            });
        }
        
        // Get the most common exam date, time, and paper for this room
        const examDateCounts = {};
        const examTimeCounts = {};
        const paperCounts = {};
        let building = '';
        
        allocations.forEach(allocation => {
            // Get building name
            if (!building && allocation.classroom && allocation.classroom.building) {
                building = allocation.classroom.building;
            }
            
            // Count exam dates
            const dateKey = allocation.examDate ? new Date(allocation.examDate).toISOString().split('T')[0] : 'unknown';
            examDateCounts[dateKey] = (examDateCounts[dateKey] || 0) + 1;
            
            // Count exam times
            const timeKey = allocation.examTime || 'unknown';
            examTimeCounts[timeKey] = (examTimeCounts[timeKey] || 0) + 1;
            
            // Count papers
            const paperKey = allocation.paper && allocation.paper.code ? allocation.paper.code : 'unknown';
            if (!paperCounts[paperKey]) {
                paperCounts[paperKey] = {
                    count: 0,
                    name: allocation.paper && allocation.paper.name ? allocation.paper.name : 'Unknown'
                };
            }
            paperCounts[paperKey].count++;
        });
        
        // Find the most common values
        let mostCommonDate = Object.keys(examDateCounts).reduce((a, b) => 
            examDateCounts[a] > examDateCounts[b] ? a : b, Object.keys(examDateCounts)[0]);
            
        let mostCommonTime = Object.keys(examTimeCounts).reduce((a, b) => 
            examTimeCounts[a] > examTimeCounts[b] ? a : b, Object.keys(examTimeCounts)[0]);
            
        let mostCommonPaper = Object.keys(paperCounts).reduce((a, b) => 
            paperCounts[a].count > paperCounts[b].count ? a : b, Object.keys(paperCounts)[0]);
        
        // Prepare response
        const details = {
            room,
            building,
            examDate: mostCommonDate !== 'unknown' ? mostCommonDate : null,
            examTime: mostCommonTime !== 'unknown' ? mostCommonTime : null,
            paperCode: mostCommonPaper !== 'unknown' ? mostCommonPaper : null,
            paperName: mostCommonPaper !== 'unknown' ? paperCounts[mostCommonPaper].name : null,
            studentCount: allocations.length,
            totalSeats: 40, // Assuming 40 seats per classroom, adjust as needed
            allocations: allocations.length
        };
        
        await allocatedClassroomsDB.close();
        
        res.json({
            success: true,
            details
        });
        
    } catch (error) {
        console.error('Error fetching classroom details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch classroom details',
            error: error.message
        });
    }
});

// Add endpoint to get papers scheduled in a specific classroom
app.get('/api/papers-by-classroom', async (req, res) => {
    try {
        const { room } = req.query;
        
        if (!room) {
            return res.status(400).json({
                success: false,
                message: 'Room number is required'
            });
        }
        
        console.log(`Fetching papers for classroom: ${room}`);
        
        // Connect to allocated_classrooms database
        const allocatedClassroomsDB = mongoose.createConnection('mongodb://127.0.0.1:27017/allocated_classrooms');
        const AllocatedClassroom = allocatedClassroomsDB.model('allocatedclassrooms', seatingSchema);
        
        // Get distinct papers scheduled in this classroom
        const papers = await AllocatedClassroom.aggregate([
            { $match: { 'classroom.room': room } },
            { 
                $group: { 
                    _id: { 
                        code: "$paper.code", 
                        name: "$paper.name" 
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    code: "$_id.code",
                    name: "$_id.name"
                }
            },
            { $sort: { code: 1 } }
        ]);
        
        console.log(`Found ${papers.length} papers for classroom ${room}`);
        console.log('Papers:', papers);
        
        await allocatedClassroomsDB.close();
        
        res.json({
            success: true,
            papers: papers
        });
    } catch (error) {
        console.error('Error fetching papers for classroom:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch papers for classroom',
            error: error.message
        });
    }
});