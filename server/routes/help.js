// Help Request Routes - junior-senior connect system
const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');
const authMiddleware = require('../middleware/auth');

// POST /api/help/request - junior student creates a help request
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const helpRequest = new HelpRequest({
      studentId: req.user.id,
      studentName: req.user.name,
      title,
      description,
      category: category || 'other',
    });

    await helpRequest.save();
    res.status(201).json({ message: 'Help request created!', helpRequest });
  } catch (error) {
    console.error('Create help request error:', error);
    res.status(500).json({ message: 'Failed to create help request.' });
  }
});

// GET /api/help/requests - get all open help requests (seniors view this)
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    // Seniors see all open requests; students see their own requests
    let query = {};
    if (req.user.role === 'junior') {
      query = { studentId: req.user.id };
    } else {
      query = { status: 'open' }; // seniors see open requests
    }

    const requests = await HelpRequest.find(query).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    console.error('Get help requests error:', error);
    res.status(500).json({ message: 'Failed to fetch help requests.' });
  }
});

// GET /api/help/all - get all requests for seniors/mentors
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const requests = await HelpRequest.find({}).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    console.error('Get all help requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests.' });
  }
});

// PUT /api/help/accept/:id - senior/mentor accepts a help request
router.put('/accept/:id', authMiddleware, async (req, res) => {
  try {
    // Only seniors and mentors can accept requests
    if (req.user.role === 'junior') {
      return res.status(403).json({ message: 'Only seniors and mentors can accept requests.' });
    }

    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Help request not found.' });
    }

    if (request.status !== 'open') {
      return res.status(400).json({ message: 'This request is already accepted.' });
    }

    request.status = 'accepted';
    request.acceptedBy = req.user.id;
    request.acceptedByName = req.user.name;
    await request.save();

    res.json({ message: 'Request accepted!', request });
  } catch (error) {
    console.error('Accept help request error:', error);
    res.status(500).json({ message: 'Failed to accept request.' });
  }
});

// DELETE /api/help/request/:id - student deletes their own request
router.delete('/request/:id', authMiddleware, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    if (request.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this request.' });
    }
    await request.deleteOne();
    res.json({ message: 'Request deleted.' });
  } catch (error) {
    console.error('Delete help request error:', error);
    res.status(500).json({ message: 'Failed to delete request.' });
  }
});

module.exports = router;
