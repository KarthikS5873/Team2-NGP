// Post Model - community feed posts (doubts, resources, discussions)
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorRole: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 1000,
  },
  // Type helps categorize posts in the community feed
  type: {
    type: String,
    enum: ['doubt', 'resource', 'discussion', 'announcement'],
    default: 'discussion',
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
