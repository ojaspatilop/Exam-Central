const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { facultySchema } = require("../models/Faculty");

// Login route
router.post("/login", async (req, res) => {
    try {
        const { role, username, password } = req.body;
        console.log("Login attempt:", { role, username }); // Log the attempt

        if (role === "faculty") {
            // Get the Faculty model from app.locals
            const Faculty = req.app.locals.Faculty;
            if (!Faculty) {
                console.error("Faculty model not found in app.locals");
                return res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }

            // Find faculty by username in personalInfo
            const faculty = await Faculty.findOne({
                "personalInfo.username": username
            });
            console.log("Faculty search result:", faculty ? "Found" : "Not found");

            if (!faculty) {
                return res.status(401).json({
                    success: false,
                    message: "Faculty not found"
                });
            }

            // Check password
            if (faculty.personalInfo.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }
                       // Generate JWT token
                       const token = jwt.sign(
                        {
                            userId: faculty._id,
                            role: "faculty",
                            name: faculty.personalInfo.name,
                            email: faculty.personalInfo.email
                        },
                        'your-secret-key', // In production, use environment variable
                        { expiresIn: '24h' }
                    );        

            // Return success response
            return res.json({
                success: true,
                token,
                message: "Login successful",
                faculty: {
                    name: faculty.personalInfo.name,
                    email: faculty.personalInfo.email
                }
            });
        }

        // Handle other role logins (student, admin) as before
        let user;
        if (role === "student") {
            user = await User.findOne({ rollNumber: req.body.rollNumber, role: "student" });
        } else {
            user = await User.findOne({ username, role });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Check password
        if (user.password !== password) { // In production, use proper password hashing
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role,
                rollNumber: user.rollNumber 
            },
            'your-secret-key', // In production, use environment variable
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;
