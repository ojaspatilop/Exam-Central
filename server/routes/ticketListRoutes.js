const express = require("express");
const router = express.Router();
const { TicketList } = require("../server"); // Import the TicketList model from server.js

// Get all tickets with pagination and filtering
router.get("/tickets", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);
    
    // Count total documents matching the filter
    const total = await TicketList.countDocuments(filter);
    
    // Get tickets with pagination
    const tickets = await TicketList.find(filter)
      .sort({ generatedDate: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      success: true,
      tickets,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTickets: total
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message
    });
  }
});

// Get a specific ticket by hall ticket number
router.get("/tickets/:hallTicketNumber", async (req, res) => {
  try {
    const { hallTicketNumber } = req.params;
    
    const ticket = await TicketList.findOne({ hallTicketNumber });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    
    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
      error: error.message
    });
  }
});

// Search tickets
router.get("/tickets/search", async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term || term.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search term must be at least 2 characters"
      });
    }
    
    const tickets = await TicketList.find({
      $or: [
        { hallTicketNumber: { $regex: term, $options: 'i' } },
        { studentRollNo: { $regex: term, $options: 'i' } },
        { firstName: { $regex: term, $options: 'i' } },
        { lastName: { $regex: term, $options: 'i' } }
      ]
    }).limit(20);
    
    res.json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error("Error searching tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search tickets",
      error: error.message
    });
  }
});

// Add a new ticket
router.post("/tickets", async (req, res) => {
  try {
    const ticketData = req.body;
    
    // Validate required fields
    if (!ticketData.hallTicketNumber || !ticketData.studentRollNo || 
        !ticketData.firstName || !ticketData.lastName || 
        !ticketData.branch || !ticketData.semester || !ticketData.examination) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    
    // Check if ticket already exists
    const existingTicket = await TicketList.findOne({ 
      hallTicketNumber: ticketData.hallTicketNumber 
    });
    
    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: "A ticket with this hall ticket number already exists"
      });
    }
    
    // Create new ticket
    const newTicket = new TicketList(ticketData);
    await newTicket.save();
    
    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
      error: error.message
    });
  }
});

// Update a ticket
router.put("/tickets/:hallTicketNumber", async (req, res) => {
  try {
    const { hallTicketNumber } = req.params;
    const updateData = req.body;
    
    // Find and update the ticket
    const updatedTicket = await TicketList.findOneAndUpdate(
      { hallTicketNumber },
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    
    res.json({
      success: true,
      message: "Ticket updated successfully",
      ticket: updatedTicket
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update ticket",
      error: error.message
    });
  }
});

// Delete a ticket
router.delete("/tickets/:hallTicketNumber", async (req, res) => {
  try {
    const { hallTicketNumber } = req.params;
    
    const deletedTicket = await TicketList.findOneAndDelete({ hallTicketNumber });
    
    if (!deletedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    
    res.json({
      success: true,
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete ticket",
      error: error.message
    });
  }
});

// Sync tickets from exam hall tickets database
router.post("/tickets/sync", async (req, res) => {
  try {
    // This would be implemented to sync data from the existing hall tickets database
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: "Ticket synchronization initiated"
    });
  } catch (error) {
    console.error("Error syncing tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync tickets",
      error: error.message
    });
  }
});

module.exports = router; 