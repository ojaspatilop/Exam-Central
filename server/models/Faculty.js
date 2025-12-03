const mongoose = require("mongoose");
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
      ID: { type: String, required: true, unique: true },
      
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

// Supervisor Allocation Schema
const SupervisorSchema = new mongoose.Schema({
  supervisorId: String,
  supervisorName: String,
  department: String,
  classroom: {
      building: String,
      room: String,
  },
  examDate: Date,
  examTime: String,
  paper: {
      code: String,
      name: String,
  },
  allocatedOn: { type: Date, default: Date.now },
});

const SupervisorAllocation = facultyinfo.model("SupervisorAllocation", SupervisorSchema);

// Export both models
module.exports = {
    Faculty,
    SupervisorAllocation
};