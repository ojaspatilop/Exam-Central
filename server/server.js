const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const { spawn } = require('child_process');
const path = require('path');
const facultyRoutes = require('./routes/facultyRoutes');
const Marks = require('./models/Marks');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Import and use routesf
app.use("/api/auth", authRoutes);

// Create a new MongoDB connection specifically for exam data
const examDbConnection = mongoose.createConnection("mongodb://localhost:27017/exam_hall_tickets", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new MongoDB connection for allocated classrooms
const allocatedClassroomsConnection = mongoose.createConnection("mongodb://localhost:27017/allocated_classrooms", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

examDbConnection.on('connected', () => {
  console.log('Connected to Exam Hall Tickets Database');
});

examDbConnection.on('error', (err) => {
  console.error('Exam database connection error:', err);
});

allocatedClassroomsConnection.on('connected', () => {
  console.log('Connected to Allocated Classrooms Database');
});

allocatedClassroomsConnection.on('error', (err) => {
  console.error('Allocated Classrooms database connection error:', err);
});


const facultyinfo = mongoose.createConnection("mongodb://localhost:27017/FacultyDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

facultyinfo.on('connected', () => {
  console.log('Connected to Faculty Database');
});

facultyinfo.on('error', (err) => {
  console.error('Faculty database connection error:', err);
});

// Faculty Schema
const facultySchema = new mongoose.Schema({
  personalInfo: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  professionalInfo: {
    designation: { type: String, required: true },
    department: { type: String, required: true },
    experience: { type: Number, required: true },
    specialization: { type: String, required: true },
    publications: [{ title: String, year: Number }],
  },
  otherDetails: {
    hobbies: [String],
    achievements: [String],
    socialLinks: {
      linkedin: String,
      github: String,
    },
  },
});

const Faculty = facultyinfo.model("Faculty", facultySchema);
app.locals.Faculty = Faculty;

// Define MongoDB Schema and Models on the new connection
// Exam Form Schema
const examFormSchema = new mongoose.Schema({
  studentRollNo: {
    type: String,
    required: true,
    index: true
  },
  firstName: String,
  middleName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String,
  category: String,
  email: String,
  mobile: String,
  fatherName: String,
  motherName: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  branch: String,
  semester: Number,
  examination: String,
  examType: String,
  subjects: [{
    code: String,
    name: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Hall Ticket Schema
const hallTicketSchema = new mongoose.Schema({
  hallTicketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  studentRollNo: {
    type: String,
    required: true,
    index: true
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamForm'
  },
  firstName: String,
  middleName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String,
  branch: String,
  semester: Number,
  examination: String,
  examType: String,
  subjects: [{
    code: String,
    name: String
  }],
  examCenters: [{
    subject: String,
    date: String,
    time: String,
    venue: String
  }],
  generatedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Define Allocated Classroom Schema
const allocatedClassroomSchema = new mongoose.Schema({
  hallTicketNumber: {
    type: String,
    required: true,
    index: true
  },
  studentRollNo: {
    type: String,
    required: true,
    index: true
  },
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
    number: Number  // Combined bench number (for display)
  },
  examDate: Date,
  examTime: String,
  allocatedOn: {
    type: Date,
    default: Date.now
  }
});

// Create models on the new connection
const ExamForm = examDbConnection.model('ExamForm', examFormSchema, 'exam_forms');
const HallTicket = examDbConnection.model('HallTicket', hallTicketSchema, 'hall_tickets');
const AllocatedClassroom = allocatedClassroomsConnection.model('AllocatedClassroom', allocatedClassroomSchema);

// Routes
app.use("/api", studentRoutes);
app.use("/api/auth", authRoutes); // This will handle all auth routes including login

// Add exam form submission endpoint
app.post("/api/submit-exam-form", async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.rollNo || !formData.firstName || !formData.lastName || !formData.branch || !formData.semester) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    
    console.log("Received form data:", formData);
    
    // Create a new exam form document
    const examForm = new ExamForm({
      studentRollNo: formData.rollNo,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      category: formData.category,
      email: formData.email,
      mobile: formData.mobile,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      branch: formData.branch,
      semester: formData.semester,
      examination: formData.examination,
      examType: formData.examType,
      subjects: formData.subjects
    });
    
    // Save the form data
    const savedForm = await examForm.save();
    console.log("Exam form saved with ID:", savedForm._id);
    
    // Generate hall ticket number
    const hallTicketNumber = "HT" + Date.now().toString().slice(-8);
    
    // Create exam schedule based on subjects
    const examCenters = formData.subjects.map((subject, index) => {
      // Generate dates starting from Dec 5, 2024, with 2-day intervals
      const examDate = new Date(2024, 11, 5 + (index * 2));
      const formattedDate = examDate.toISOString().split('T')[0];
      
      // Alternate between different halls
      const venues = ["Examination Hall A", "Examination Hall B", "Examination Hall C"];
      const venue = venues[index % venues.length];
      
      return {
        subject: subject.code,
        date: formattedDate,
        time: "10:00 AM",
        venue: venue
      };
    });
    
    // Create hall ticket document
    const hallTicket = new HallTicket({
      hallTicketNumber: hallTicketNumber,
      studentRollNo: formData.rollNo,
      formId: savedForm._id,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      branch: formData.branch,
      semester: formData.semester,
      examination: formData.examination,
      examType: formData.examType,
      subjects: formData.subjects,
      examCenters: examCenters
    });
    
    // Save the hall ticket
    const savedHallTicket = await hallTicket.save();
    console.log("Hall ticket saved with ID:", savedHallTicket._id);
    
    // Return success response with hall ticket data
    res.json({
      success: true,
      message: "Exam form submitted and hall ticket generated successfully",
      formId: savedForm._id,
      hallTicket: {
        hallTicketNumber,
        studentRollNo: formData.rollNo,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        branch: formData.branch,
        semester: formData.semester,
        examination: formData.examination,
        examType: formData.examType,
        subjects: formData.subjects,
        examCenters: examCenters,
        generatedDate: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error("Exam form submission error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to submit exam form",
      error: error.message
    });
  }
});

// Add endpoint to get hall ticket by roll number
app.get("/api/hall-ticket/:rollNo", async (req, res) => {
  try {
    const { rollNo } = req.params;
    
    console.log("Fetching hall ticket for roll number:", rollNo);
    
    // Find the most recent active hall ticket for this student
    const hallTicket = await HallTicket.findOne({ 
      studentRollNo: rollNo,
      isActive: true
    }).sort({ generatedDate: -1 });
    
    if (!hallTicket) {
      return res.status(404).json({
        success: false,
        message: "No hall ticket found for this roll number"
      });
    }
    
    console.log("Found hall ticket:", hallTicket.hallTicketNumber);
    
    // Return the hall ticket data
    res.json({
      success: true,
      hallTicket: {
        hallTicketNumber: hallTicket.hallTicketNumber,
        studentRollNo: hallTicket.studentRollNo,
        firstName: hallTicket.firstName,
        middleName: hallTicket.middleName,
        lastName: hallTicket.lastName,
        dateOfBirth: hallTicket.dateOfBirth,
        gender: hallTicket.gender,
        branch: hallTicket.branch,
        semester: hallTicket.semester,
        examination: hallTicket.examination,
        examType: hallTicket.examType,
        subjects: hallTicket.subjects,
        examCenters: hallTicket.examCenters,
        generatedDate: hallTicket.generatedDate
      }
    });
    
  } catch (error) {
    console.error("Hall ticket retrieval error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve hall ticket",
      error: error.message
    });
  }
});

// Add endpoint to get exam form history for a student
app.get("/api/exam-forms/:rollNo", async (req, res) => {
  try {
    const { rollNo } = req.params;
    
    // Find all exam forms for this student
    const examForms = await ExamForm.find({ 
      studentRollNo: rollNo
    }).sort({ submittedAt: -1 });
    
    if (!examForms || examForms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exam forms found for this roll number"
      });
    }
    
    // Return the exam forms data
    res.json({
      success: true,
      examForms: examForms
    });
    
  } catch (error) {
    console.error("Exam form retrieval error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve exam forms",
      error: error.message
    });
  }
});

// Add endpoint to get classroom allocations
app.get("/api/allocated_classrooms", async (req, res) => {
  try {
    const { page = 1, branch, semester } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query = {};
    if (branch) query.branch = branch;
    if (semester) query.semester = parseInt(semester);

    // Get total count for pagination
    const total = await AllocatedClassroom.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get allocations with pagination
    const allocations = await AllocatedClassroom.find(query)
      .sort({ examDate: 1, examTime: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      allocations,
      currentPage: parseInt(page),
      totalPages,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classroom allocations",
      error: error.message
    });
  }
});

// Add search endpoint for classroom allocations
app.get("/api/allocated_classrooms/search", async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Search term is required"
      });
    }

    const searchRegex = new RegExp(term, 'i');
    const allocations = await AllocatedClassroom.find({
      $or: [
        { studentRollNo: searchRegex },
        { hallTicketNumber: searchRegex },
        { studentName: searchRegex },
        { 'paper.code': searchRegex },
        { 'paper.name': searchRegex },
        { 'classroom.room': searchRegex }
      ]
    }).sort({ examDate: 1, examTime: 1 });

    res.json({
      success: true,
      allocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search classroom allocations",
      error: error.message
    });
  }
});

// Modify the allocate classrooms endpoint
app.post("/api/allocate-classrooms", async (req, res) => {
  try {
    // Set default values for exam time
    const examTime = "10:00 AM";

    // Get all active hall tickets
    const hallTickets = await HallTicket.find({ isActive: true });
    
    if (!hallTickets || hallTickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hall tickets found to allocate"
      });
    }

    // First, collect all unique papers by name
    const uniquePaperNames = new Set();
    const papersByName = {};

    // Collect all papers first
    hallTickets.forEach(ticket => {
      ticket.subjects.forEach(subject => {
        // Use paper name as the key for consistency
        const paperName = subject.name;
        uniquePaperNames.add(paperName);
        
        // Store paper details by name for reference
        if (!papersByName[paperName]) {
          papersByName[paperName] = subject;
        }
      });
    });

    // Create a mapping of paper names to exam dates
    const paperDates = {};
    
    // Convert unique paper names to array and sort for consistent ordering
    const paperNamesArray = Array.from(uniquePaperNames).sort();
    
    // Assign a unique date to each paper, starting from tomorrow
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    
    // Assign dates to papers (one day apart)
    paperNamesArray.forEach((paperName, index) => {
      const examDate = new Date(startDate);
      examDate.setDate(examDate.getDate() + index);
      paperDates[paperName] = examDate;
    });

    // Collect all unique branches
    const uniqueBranches = new Set();
    hallTickets.forEach(ticket => {
      uniqueBranches.add(ticket.branch);
    });
    
    // Assign a floor number to each branch (starting from 1)
    const branchFloors = {};
    Array.from(uniqueBranches).sort().forEach((branch, index) => {
      // Assign floor numbers starting from 1 (so first floor would be 100s, second floor 200s, etc.)
      branchFloors[branch] = index + 1;
    });

    // Now group students by branch, semester, and subject
    const groupedStudents = {};
    
    hallTickets.forEach(ticket => {
      ticket.subjects.forEach(subject => {
        const key = `${ticket.branch}-${ticket.semester}-${subject.code}`;
        if (!groupedStudents[key]) {
          groupedStudents[key] = [];
        }
        groupedStudents[key].push({
          hallTicketNumber: ticket.hallTicketNumber,
          studentRollNo: ticket.studentRollNo,
          studentName: `${ticket.firstName} ${ticket.middleName || ''} ${ticket.lastName}`.trim(),
          branch: ticket.branch,
          semester: ticket.semester,
          paper: subject
        });
      });
    });

    // Track bench assignments per student across different papers
    const studentBenchHistory = {};

    // Track classroom usage per branch
    const branchClassroomCounters = {};
    uniqueBranches.forEach(branch => {
      branchClassroomCounters[branch] = 1; // Start with room 1 for each branch
    });

    // Allocate classrooms for each group
    const allocations = [];
    const STUDENTS_PER_ROOM = 30;
    const ROOMS_PER_FLOOR = 7;
    const ROWS = 6;
    const COLUMNS = 5;
    const TOTAL_BENCHES = ROWS * COLUMNS;

    for (const group in groupedStudents) {
      const students = groupedStudents[group];
      const branch = group.split('-')[0]; // Extract branch from the group key
      
      // Get the floor number for this branch
      const floorNumber = branchFloors[branch];
      
      // Get the paper name from the first student
      const paperName = students[0].paper.name;
      
      // Get the exam date for this paper name
      const examDate = paperDates[paperName];
      
      // Log for debugging
      console.log(`Group: ${group}, Branch: ${branch}, Floor: ${floorNumber}, Paper: ${paperName}, Date: ${examDate}`);
      
      for (let i = 0; i < students.length; i += STUDENTS_PER_ROOM) {
        const batch = students.slice(i, i + STUDENTS_PER_ROOM);
        const batchSize = batch.length;
        
        // Get the next room number for this branch
        let roomCounter = branchClassroomCounters[branch];
        
        // If we've used all 7 rooms on this floor, wrap around to room 1
        if (roomCounter > ROOMS_PER_FLOOR) {
          roomCounter = 1;
        }
        
        // Calculate the actual room number (floor * 100 + room number)
        const roomNumber = (floorNumber * 100) + roomCounter;
        
        // Update the room counter for this branch
        branchClassroomCounters[branch] = roomCounter + 1;
        
        // Create an array of available bench positions for this classroom
        const availableBenchPositions = Array.from({ length: TOTAL_BENCHES }, (_, i) => i);
        
        // Shuffle the bench positions to randomize assignments
        shuffleArray(availableBenchPositions);
        
        // Assign bench numbers to students in this batch
        const batchAllocations = batch.map((student, batchIndex) => {
          const studentId = student.studentRollNo;
          
          // Get previously assigned bench positions for this student (if any)
          if (!studentBenchHistory[studentId]) {
            studentBenchHistory[studentId] = [];
          }
          
          // Get a random bench position that hasn't been used by this student before if possible
          let benchPosition;
          
          // Try to find a bench position that this student hasn't used before
          let startIdx = Math.floor(Math.random() * availableBenchPositions.length);
          let found = false;
          
          // Try each available position, starting from the random index
          for (let j = 0; j < availableBenchPositions.length; j++) {
            const idx = (startIdx + j) % availableBenchPositions.length;
            const position = availableBenchPositions[idx];
            
            // Check if this student has used this bench position before
            if (!studentBenchHistory[studentId].includes(position)) {
              benchPosition = position;
              availableBenchPositions.splice(idx, 1); // Remove this position from available positions
              studentBenchHistory[studentId].push(position); // Record this position for the student
              found = true;
              break;
            }
          }
          
          // If all positions have been used by this student before, just use the next available one
          if (!found && availableBenchPositions.length > 0) {
            benchPosition = availableBenchPositions.shift();
            studentBenchHistory[studentId].push(benchPosition);
          } else if (!found) {
            // Fallback if somehow we run out of positions
            benchPosition = batchIndex % TOTAL_BENCHES;
          }
          
          // Calculate row and column from the bench position
          const row = Math.floor(benchPosition / COLUMNS) + 1; // 1-indexed row
          const column = (benchPosition % COLUMNS) + 1; // 1-indexed column
          const benchNumber = benchPosition + 1; // 1-indexed bench number
          
          return {
            hallTicketNumber: student.hallTicketNumber,
            studentRollNo: student.studentRollNo,
            studentName: student.studentName,
            branch: student.branch,
            semester: student.semester,
            paper: student.paper,
            classroom: {
              building: floorNumber.toString(), // Store floor number as building for reference
              room: roomNumber.toString()
            },
            benchNumber: {
              row,
              column,
              number: benchNumber
            },
            examDate: examDate,
            examTime
          };
        });
        
        allocations.push(...batchAllocations);
      }
    }

    // Clear existing allocations
    await AllocatedClassroom.deleteMany({});

    // Save new allocations to database
    if (allocations.length > 0) {
      await AllocatedClassroom.insertMany(allocations);
    }

    // Add detailed debugging information
    console.log("Branch to Floor mapping:");
    for (const [branch, floor] of Object.entries(branchFloors)) {
      console.log(`  ${branch}: Floor ${floor}`);
    }
    
    console.log("Paper dates mapping:");
    for (const [paperName, date] of Object.entries(paperDates)) {
      console.log(`  ${paperName}: ${date.toISOString().split('T')[0]}`);
    }
    
    // Check for any papers with the same name but different dates
    const paperNameToDateMap = {};
    allocations.forEach(allocation => {
      const paperName = allocation.paper.name;
      const dateStr = allocation.examDate.toISOString().split('T')[0];
      
      if (!paperNameToDateMap[paperName]) {
        paperNameToDateMap[paperName] = dateStr;
      } else if (paperNameToDateMap[paperName] !== dateStr) {
        console.error(`INCONSISTENCY: Paper "${paperName}" has multiple dates: ${paperNameToDateMap[paperName]} and ${dateStr}`);
      }
    });

    res.json({
      success: true,
      message: "Classrooms allocated successfully",
      allocationsCount: allocations.length,
      allocations
    });

  } catch (error) {
    console.error("Classroom allocation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to allocate classrooms",
      error: error.message
    });
  }
});

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Add endpoint to get seating arrangements by student roll number
app.get("/api/student/seating/:rollNo", async (req, res) => {
  try {
    const { rollNo } = req.params;
    
    if (!rollNo) {
      return res.status(400).json({
        success: false,
        message: "Student roll number is required"
      });
    }

    // Find all seating arrangements for the student
    const allocations = await AllocatedClassroom.find({ 
      studentRollNo: rollNo 
    }).sort({ examDate: 1, examTime: 1 });

    res.json({
      success: true,
      allocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seating arrangements",
      error: error.message
    });
  }
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start admin server
const startAdminServer = () => {
  const adminServerPath = path.join(__dirname, '../Admin/adminserver.js');
  const adminServer = spawn('node', [adminServerPath], {
    stdio: 'inherit'
  });

  adminServer.on('error', (err) => {
    console.error('Failed to start admin server:', err);
  });

  process.on('exit', () => {
    adminServer.kill();
  });
};

// Add endpoint to get all classroom allocations
app.get("/api/classroom-allocations", async (req, res) => {
  try {
    // Get all allocations from the database
    const allocations = await AllocatedClassroom.find({})
      .sort({ examDate: 1, examTime: 1 });

    res.json({
      success: true,
      allocations
    });
  } catch (error) {
    console.error("Error fetching classroom allocations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classroom allocations",
      error: error.message
    });
  }
});

// Add search endpoint for classroom allocations
app.get("/api/classroom-allocations/search", async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Search term is required"
      });
    }

    const searchRegex = new RegExp(term, 'i');
    const allocations = await AllocatedClassroom.find({
      $or: [
        { studentRollNo: searchRegex },
        { hallTicketNumber: searchRegex },
        { studentName: searchRegex },
        { 'paper.code': searchRegex },
        { 'paper.name': searchRegex },
        { 'classroom.room': searchRegex }
      ]
    }).sort({ examDate: 1, examTime: 1 });

    res.json({
      success: true,
      allocations
    });
  } catch (error) {
    console.error("Error searching classroom allocations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search classroom allocations",
      error: error.message
    });
  }
});

// Get unique classrooms
app.get("/api/unique-classrooms", async (req, res) => {
  try {
    const classrooms = await AllocatedClassroom.distinct("classroom.room");
    
    res.json({
      success: true,
      classrooms
    });
  } catch (error) {
    console.error("Error fetching unique classrooms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classrooms"
    });
  }
});

// Get unique papers
app.get("/api/unique-papers", async (req, res) => {
  try {
    const papers = await AllocatedClassroom.distinct("paper");
    
    res.json({
      success: true,
      papers
    });
  } catch (error) {
    console.error("Error fetching unique papers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch papers"
    });
  }
});

// Get seating arrangement for a classroom
app.get("/api/seating-arrangement", async (req, res) => {
  try {
    const { classroom, date, time, paperId } = req.query;
    
    if (!classroom || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Classroom, date and time are required"
      });
    }
    
    // Parse the date correctly
    const examDate = new Date(date);
    
    // Build the query
    const query = {
      "classroom.room": classroom,
      examTime: time
    };
    
    // Add date comparison (matching the date part only)
    query.examDate = {
      $gte: new Date(examDate.setHours(0, 0, 0, 0)),
      $lt: new Date(examDate.setHours(23, 59, 59, 999))
    };
    
    // Add paper filter if provided
    if (paperId) {
      query["paper.id"] = paperId;
    }
    
    // Get allocations for this classroom
    const allocations = await AllocatedClassroom.find(query).lean();
    
    // Get the paper name if paperId is provided
    let paperName = "All Papers";
    if (paperId && allocations.length > 0) {
      paperName = allocations[0].paper.name;
    }
    
    // Create a grid of all possible seats in the classroom
    // For this example, we'll create a standard layout with rows and columns
    // In a real implementation, you might want to fetch the actual classroom layout from a database
    
    // Determine the maximum bench number from allocations
    let maxBenchNumber = 0;
    allocations.forEach(allocation => {
      if (allocation.benchNumber && allocation.benchNumber.number > maxBenchNumber) {
        maxBenchNumber = allocation.benchNumber.number;
      }
    });
    
    // Ensure we have at least 30 seats (5x6 grid) or more if needed
    maxBenchNumber = Math.max(maxBenchNumber, 30);
    
    // Create seating data
    const seatingData = [];
    
    for (let i = 1; i <= maxBenchNumber; i++) {
      // Find if this seat is allocated
      const allocation = allocations.find(a => a.benchNumber && a.benchNumber.number === i);
      
      // Create seat object
      const seat = {
        benchNumber: i,
        isOccupied: !!allocation
      };
      
      // Add student info if seat is occupied
      if (allocation) {
        seat.studentName = allocation.studentName;
        seat.studentRollNo = allocation.studentRollNo;
        seat.hallTicketNumber = allocation.hallTicketNumber;
        seat.branch = allocation.branch;
        seat.semester = allocation.semester;
        seat.paperName = allocation.paper.name;
      }
      
      seatingData.push(seat);
    }
    
    res.json({
      success: true,
      seatingData,
      paperName
    });
  } catch (error) {
    console.error("Error fetching seating arrangement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seating arrangement"
    });
  }
});

// Use faculty routes
app.use('/api/faculty', facultyRoutes);

// Start servers
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
  startAdminServer();
});
