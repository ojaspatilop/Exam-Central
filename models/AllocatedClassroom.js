const mongoose = require('mongoose');

const allocatedClassroomSchema = new mongoose.Schema({
    // ... your existing fields ...
    isManual: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('AllocatedClassroom', allocatedClassroomSchema); 