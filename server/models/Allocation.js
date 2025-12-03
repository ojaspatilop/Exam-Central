const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema({
    // ... existing fields ...
    
    // Add this field to track whether the allocation is revealed to students
    isRevealed: {
        type: Boolean,
        default: false
    }
    
    // ... other fields ...
});

module.exports = mongoose.model('Allocation', AllocationSchema); 