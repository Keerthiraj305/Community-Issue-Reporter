// Importing the Mongoose Library
const mongoose = require('mongoose');

// Define the schema for an Issue
const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Street Light', 'Garbage', 'Drainage', 'Other'],
        default: 'Other'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'],
        default: 'Open'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ward: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    images: [{
        type: String
    }],
    adminNotes: {
        type: String,
        trim: true
    },
    resolutionDetails: {
        type: String,
        trim: true
    },
    estimatedCompletionDate: {
        type: Date
    },
    actualCompletionDate: {
        type: Date
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
issueSchema.index({ status: 1, priority: 1, category: 1, ward: 1 });

// Creating the mongoose model
module.exports = mongoose.model('Issue', issueSchema); 