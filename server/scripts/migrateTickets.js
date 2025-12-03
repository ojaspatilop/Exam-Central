const mongoose = require("mongoose");
const { TicketList } = require("../server");

// Connect to the exam hall tickets database
const examDbConnection = mongoose.createConnection("mongodb://localhost:27017/exam_hall_tickets", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Hall Ticket schema for the source database
const hallTicketSchema = new mongoose.Schema({
  hallTicketNumber: String,
  studentRollNo: String,
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
  generatedDate: Date,
  isActive: Boolean
});

// Create the model on the exam database connection
const HallTicket = examDbConnection.model('HallTicket', hallTicketSchema, 'hall_tickets');

async function migrateTickets() {
  try {
    console.log('Starting ticket migration...');
    
    // Get all hall tickets from the source database
    const hallTickets = await HallTicket.find({ isActive: true });
    
    console.log(`Found ${hallTickets.length} hall tickets to migrate`);
    
    // Process each hall ticket
    for (const ticket of hallTickets) {
      // Check if ticket already exists in the target database
      const existingTicket = await TicketList.findOne({ 
        hallTicketNumber: ticket.hallTicketNumber 
      });
      
      if (existingTicket) {
        console.log(`Ticket ${ticket.hallTicketNumber} already exists, skipping`);
        continue;
      }
      
      // Create a new ticket in the target database
      const newTicket = new TicketList({
        hallTicketNumber: ticket.hallTicketNumber,
        studentRollNo: ticket.studentRollNo,
        firstName: ticket.firstName,
        middleName: ticket.middleName,
        lastName: ticket.lastName,
        dateOfBirth: ticket.dateOfBirth,
        gender: ticket.gender,
        branch: ticket.branch,
        semester: ticket.semester,
        examination: ticket.examination,
        examType: ticket.examType,
        subjects: ticket.subjects,
        examCenters: ticket.examCenters,
        isActive: ticket.isActive,
        generatedDate: ticket.generatedDate
      });
      
      await newTicket.save();
      console.log(`Migrated ticket ${ticket.hallTicketNumber}`);
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close connections
    await examDbConnection.close();
    process.exit(0);
  }
}

// Run the migration
migrateTickets(); 