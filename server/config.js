const config = {
    port: process.env.PORT || 5000,
    mongoURIs: {
        exam: 'mongodb://localhost:27017/exam_db',
        classroom: 'mongodb://localhost:27017/classroom_db',
        student: 'mongodb://localhost:27017/student_db'
    },
    corsOptions: {
        origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
};

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/classroom_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to classroom_db");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = { config, connectDB }; 