// Guidance Routes - AI scenario analysis using Llama 3 via Groq
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Guidance = require('../models/Guidance');
const authMiddleware = require('../middleware/auth');

// Initialize Groq client with Llama 3
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/guidance/generate - calls Llama 3 via Groq and saves result
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { year, department, careerGoal, problemStatement } = req.body;

    if (!year || !department || !careerGoal || !problemStatement) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Structured prompt for Llama 3
    const prompt = `You are a career guidance AI for college students. A student has provided the following details:

- Current Year: ${year}
- Department: ${department}
- Career Goal: ${careerGoal}
- Problem Statement: ${problemStatement}

Provide detailed, actionable career guidance. Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text, just the JSON):
{
  "skillsToLearn": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "recommendedProjects": ["project1 with brief description", "project2", "project3"],
  "suggestedResources": ["Platform/Course name - topic", "resource2", "resource3", "resource4"],
  "roadmap": ["Step 1: action item", "Step 2: action item", "Step 3: action item", "Step 4: action item", "Step 5: action item"],
  "mentorType": "Description of the ideal mentor profile for this student",
  "summary": "A 2-3 sentence personalized summary of the guidance and key advice"
}`;

    // Call Llama 3.3 70B via Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a career guidance expert for college students. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '';

    // Parse JSON response from Llama
    let parsedOutput;
    try {
      // Strip any accidental markdown code fences
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      parsedOutput = JSON.parse(cleanedText);
    } catch (parseError) {
      // Fallback structure if JSON parsing fails
      parsedOutput = {
        skillsToLearn: ['Review the AI response below for skills'],
        recommendedProjects: ['Review the AI response below for projects'],
        suggestedResources: ['Review the AI response below for resources'],
        roadmap: ['Review the AI response below for roadmap steps'],
        mentorType: 'Technical and career mentor',
        summary: responseText,
      };
    }

    // Save guidance to database
    const guidance = new Guidance({
      userId: req.user.id,
      scenario: { year, department, careerGoal, problemStatement },
      generatedOutput: parsedOutput,
    });
    await guidance.save();

    res.status(201).json({
      message: 'Guidance generated successfully!',
      guidance,
    });
  } catch (error) {
    console.error('Guidance generation error:', error?.message || error);
    res.status(500).json({
      message: 'Failed to generate guidance. Please check your GROQ_API_KEY in .env',
    });
  }
});

// GET /api/guidance/history - fetch user's past guidance records
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await Guidance.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // newest first
      .limit(10);

    res.json({ history });
  } catch (error) {
    console.error('Guidance history error:', error);
    res.status(500).json({ message: 'Failed to fetch guidance history.' });
  }
});

module.exports = router;
