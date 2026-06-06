// Community Routes - simple CRUD for the community feed
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// POST /api/community/post - create a new post
router.post('/post', authMiddleware, async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required.' });
    }

    const post = new Post({
      author: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content: content.trim(),
      type: type || 'discussion',
    });

    await post.save();
    res.status(201).json({ message: 'Post created!', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

// GET /api/community/posts - get all posts (newest first)
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(50);
    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts.' });
  }
});

// DELETE /api/community/post/:id - author can delete their own post
router.delete('/post/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post.' });
  }
});

module.exports = router;
