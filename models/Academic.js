const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    marks: {
        internal: {
            obtained: {
                type: Number,
                default: 0,
                min: 0,
                max: 25
            },
            total: {
                type: Number,
                default: 25
            }
        },
        semester: {
            obtained: {
                type: Number,
                default: 0,
                min: 0,
                max: 75
            },
            total: {
                type: Number,
                default: 75
            }
        },
        practical: {
            obtained: {
                type: Number,
                default: 0,
                min: 0,
                max: 25
            },
            total: {
                type: Number,
                default: 25
            }
        },
        termwork: {
            obtained: {
                type: Number,
                default: 0,
                min: 0,
                max: 25
            },
            total: {
                type: Number,
                default: 25
            }
        }
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Academic', academicSchema); 