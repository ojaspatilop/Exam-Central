const mongoose = require("mongoose");

const ticketListSchema = new mongoose.Schema({
  // Hall Ticket Information
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
  
  // Student Information
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String },
  
  // Academic Information
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  examination: { type: String, required: true },
  examType: { type: String }, // Regular/KT
  subjects: [
    {
      code: String,
      name: String,
    },
  ],
  
  // Exam Centers
  examCenters: [{
    subject: String,
    date: String,
    time: String,
    venue: String
  }],
  
  // Status and Timestamps
  isActive: { type: Boolean, default: true },
  generatedDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
ticketListSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = ticketListSchema; 