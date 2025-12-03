const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const mongoose = require('mongoose');

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

// Create a connection to the grade cards database
const gradeCardConnection = mongoose.createConnection("mongodb://localhost:27017/GradeCardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Import the GradeCard schema
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

// Create the GradeCard model
const GradeCard = gradeCardConnection.model('GradeCard', gradeCardSchema);

// Submit form
router.post("/submit-form", async (req, res) => {
  try {
    // Log the incoming request
    console.log("Received form data:", req.body);

    // Validate required fields
    const requiredFields = [
      "firstName",
      "middleName",
      "lastName",
      "dateOfBirth",
      "gender",
      "category",
      "email",
      "mobile",
      "fatherName",
      "motherName",
      "address",
      "city",
      "state",
      "pincode",
      "branch",
      "semester",
      "examination",
      "examType",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const studentData = new Student(req.body);
    await studentData.save();

    console.log("Saved successfully:", studentData);

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: studentData,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(400).json({
      success: false,
      message: "Error submitting form",
      error: error.message,
    });
  }
});

// Save draft
router.post("/save-draft", async (req, res) => {
  try {
    const studentData = new Student({
      ...req.body,
      status: "draft",
    });
    await studentData.save();
    res.status(201).json({
      success: true,
      message: "Draft saved successfully",
      data: studentData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error saving draft",
      error: error.message,
    });
  }
});

// Get student form by ID
router.get("/student-form/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching form",
      error: error.message,
    });
  }
});

// Route to get allocations for a specific student
router.get('/student/allocations/:rollNo', async (req, res) => {
    try {
        const { rollNo } = req.params;

        if (!rollNo) {
            return res.status(400).json({
                success: false,
                message: "Student roll number is required"
            });
        }

        // Log the roll number being queried
        console.log(`Querying allocations for roll number: ${rollNo}`);

        // Fetch allocations for the student using the correct collection name
        const allocations = await AllocatedClassroom.find({ studentRollNo: rollNo });

        // Log allocations to the terminal
        console.log(`Allocations for student ${rollNo}:`, allocations);

        res.json({
            success: true,
            allocations
        });
    } catch (error) {
        console.error("Error fetching allocations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch allocations",
            error: error.message
        });
    }
});

// Route to get grade cards for a student
router.get('/student/gradecards/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;
        
        if (!rollNumber) {
            return res.status(400).json({
                success: false,
                message: "Student roll number is required"
            });
        }
        
        console.log(`Fetching grade cards for roll number: ${rollNumber}`);
        
        // Find all grade cards for the student
        const gradeCards = await GradeCard.find({ rollNumber })
            .sort({ semester: 1, generatedAt: -1 });
        
        console.log(`Found ${gradeCards.length} grade cards for student ${rollNumber}`);
        
        res.json({
            success: true,
            gradeCards
        });
    } catch (error) {
        console.error("Error fetching grade cards:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch grade cards",
            error: error.message
        });
    }
});

module.exports = router;
