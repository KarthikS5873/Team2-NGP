// KnowledgeVault Model - seniors share valuable resource links
const mongoose = require('mongoose');

const knowledgeVaultSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  // External URL to the resource (no file upload, links only)
  link: {
    type: String,
    required: [true, 'Resource link is required'],
  },
  category: {
    type: String,
    enum: ['notes', 'interview', 'hackathon', 'project', 'roadmap', 'other'],
    default: 'other',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeVault', knowledgeVaultSchema);
