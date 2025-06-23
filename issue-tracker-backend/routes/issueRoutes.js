// Importing the dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const Issue = require('../models/Issue');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all issues (public - no auth required)
router.get('/', async (req, res) => {
  try {
    const { status, category, ward, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (ward) filter.ward = ward;

    const skip = (page - 1) * limit;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalIssues: total
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new issue (public - no auth required)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category = 'General',
      priority = 'Medium',
      ward = 'Unknown',
      pincode,
      images
    } = req.body;

    const issue = new Issue({
      title,
      description,
      location,
      category,
      priority,
      ward,
      pincode,
      images,
      reportedBy: null // No user ID for public submissions
    });

    await issue.save();

    const populatedIssue = await Issue.findById(issue._id);

    res.status(201).json({
      message: 'Issue reported successfully',
      issue: populatedIssue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single issue by ID
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new issue (authenticated - requires login)
router.post('/auth', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      priority,
      ward,
      pincode,
      images
    } = req.body;

    const issue = new Issue({
      title,
      description,
      location,
      category,
      priority,
      ward,
      pincode,
      images,
      reportedBy: req.user.userId
    });

    await issue.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email');

    res.status(201).json({
      message: 'Issue reported successfully',
      issue: populatedIssue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update issue status (requires authentication - only reporter or admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { userId, role } = req.user;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const isReporter = issue.reportedBy && issue.reportedBy.toString() === userId;

    if (role === 'admin') {
      // Admins can set status to In Progress, Under Review, or Closed
      if (['In Progress', 'Under Review', 'Closed'].includes(status)) {
        issue.status = status;
      } else {
        return res.status(403).json({ message: 'As an admin, you can only set the status to In Progress, Under Review, or Closed.' });
      }
    } else if (isReporter) {
      // The user who reported the issue can only mark it as Resolved
      if (status === 'Resolved') {
        issue.status = status;
        issue.actualCompletionDate = new Date();
      } else {
        return res.status(403).json({ message: 'You can only mark your own issue as Resolved.' });
      }
    } else {
      // Other users are not authorized to change the status
      return res.status(403).json({ message: 'You are not authorized to update this issue status.' });
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json({
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on issue (upvote/downvote)
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (voteType === 'upvote') {
      issue.upvotes += 1;
    } else if (voteType === 'downvote') {
      issue.downvotes += 1;
    }

    await issue.save();

    res.json({
      message: 'Vote recorded successfully',
      upvotes: issue.upvotes,
      downvotes: issue.downvotes
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete issue (only reporter or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get issues by user (requires authentication)
router.get('/user/my-issues', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const issues = await Issue.find({ reportedBy: req.user.userId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments({ reportedBy: req.user.userId });

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalIssues: total
      }
    });
  } catch (error) {
    console.error('Get user issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 