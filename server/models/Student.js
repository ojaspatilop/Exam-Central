const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },

  // Academic Information
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  examination: { type: String, required: true },
  examType: { type: String, required: true }, // Regular/KT
  subjects: [
    {
      code: String,
      name: String,
    },
  ],

  // File Uploads
  feeReceipt: {
    filename: String,
    path: String,
  },
  signature: {
    filename: String,
    path: String,
  },

  // Status
  status: {
    type: String,
    enum: ["draft", "submitted", "approved", "rejected"],
    default: "draft",
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", studentSchema);
