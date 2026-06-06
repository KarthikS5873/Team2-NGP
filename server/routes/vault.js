// Knowledge Vault Routes - resource links CRUD
const express = require('express');
const router = express.Router();
const KnowledgeVault = require('../models/KnowledgeVault');
const authMiddleware = require('../middleware/auth');

// POST /api/vault/resource - add a new resource
router.post('/resource', authMiddleware, async (req, res) => {
  try {
    const { title, description, link, category } = req.body;

    if (!title || !description || !link) {
      return res.status(400).json({ message: 'Title, description, and link are required.' });
    }

    const resource = new KnowledgeVault({
      title,
      description,
      link,
      category: category || 'other',
      uploadedBy: req.user.id,
      uploaderName: req.user.name,
    });

    await resource.save();
    res.status(201).json({ message: 'Resource added to vault!', resource });
  } catch (error) {
    console.error('Create vault resource error:', error);
    res.status(500).json({ message: 'Failed to add resource.' });
  }
});

// GET /api/vault/resources - get all resources
router.get('/resources', authMiddleware, async (req, res) => {
  try {
    // Optional category filter via query param: /resources?category=interview
    const filter = req.query.category ? { category: req.query.category } : {};
    const resources = await KnowledgeVault.find(filter).sort({ createdAt: -1 });
    res.json({ resources });
  } catch (error) {
    console.error('Get vault resources error:', error);
    res.status(500).json({ message: 'Failed to fetch resources.' });
  }
});

// DELETE /api/vault/resource/:id - uploader can delete their own resource
router.delete('/resource/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await KnowledgeVault.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }
    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this resource.' });
    }
    await resource.deleteOne();
    res.json({ message: 'Resource deleted.' });
  } catch (error) {
    console.error('Delete vault resource error:', error);
    res.status(500).json({ message: 'Failed to delete resource.' });
  }
});

module.exports = router;
