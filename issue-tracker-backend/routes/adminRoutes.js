const express = require('express');
const jwt = require('jsonwebtoken');
const Issue = require('../models/Issue');
const User = require('../models/User');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token and admin role
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  });
};

// Get all issues with filters and pagination
router.get('/issues', authenticateAdmin, async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      category, 
      ward, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (ward) filter.ward = ward;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalIssues: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin get issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get issue statistics
router.get('/statistics', authenticateAdmin, async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIssues = await Issue.countDocuments();
    const urgentIssues = await Issue.countDocuments({ isUrgent: true });
    const todayIssues = await Issue.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.json({
      statusStats: stats,
      priorityStats,
      categoryStats,
      totalIssues,
      urgentIssues,
      todayIssues
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update issue (admin only)
router.put('/issues/:id', authenticateAdmin, async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      adminNotes,
      resolutionDetails,
      estimatedCompletionDate,
      actualCompletionDate,
      isUrgent
    } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        status,
        priority,
        assignedTo,
        adminNotes,
        resolutionDetails,
        estimatedCompletionDate,
        actualCompletionDate,
        isUrgent
      },
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email')
     .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({
      message: 'Issue updated successfully',
      issue
    });
  } catch (error) {
    console.error('Admin update issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign issue to admin
router.put('/issues/:id/assign', authenticateAdmin, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email')
     .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({
      message: 'Issue assigned successfully',
      issue
    });
  } catch (error) {
    console.error('Assign issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (activate/deactivate)
router.put('/users/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin user
router.post('/create-admin', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new admin user
    const adminUser = new User({
      name,
      email,
      password,
      phone,
      role: 'admin'
    });

    await adminUser.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 