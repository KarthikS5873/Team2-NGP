// HelpRequest Model - junior students post requests, seniors can accept
const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['career', 'project', 'internship', 'skills', 'academics', 'other'],
    default: 'other',
  },
  // Status tracks the lifecycle of a help request
  status: {
    type: String,
    enum: ['open', 'accepted', 'closed'],
    default: 'open',
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  acceptedByName: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
