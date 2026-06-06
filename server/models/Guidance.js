// Guidance Model - stores AI-generated career guidance for students
const mongoose = require('mongoose');

const guidanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Input scenario from the student
  scenario: {
    year: String,
    department: String,
    careerGoal: String,
    problemStatement: String,
  },
  // AI-generated structured output
  generatedOutput: {
    skillsToLearn: [String],
    recommendedProjects: [String],
    suggestedResources: [String],
    roadmap: [String],
    mentorType: String,
    summary: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Guidance', guidanceSchema);
