const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route   GET api/users
// @desc    Get all users
// @access  Admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Admin
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/users
// @desc    Create a new user
// @access  Admin
router.post('/', [
  adminAuth,
  [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be at least 3 characters').isLength({ min: 3 }),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('name', 'Name is required').not().isEmpty(),
    check('role', 'Role must be either admin or scout').isIn(['admin', 'scout'])
  ]
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, name, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const userData = { username, password, name, role };
    const user = await User.create(userData);
    
    res.json(user);
  } catch (err) {
    console.error('Create user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Admin
router.put('/:id', [
  adminAuth,
  [
    check('username', 'Username must be at least 3 characters').optional().isLength({ min: 3 }),
    check('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 }),
    check('role', 'Role must be either admin or scout').optional().isIn(['admin', 'scout'])
  ]
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get all users to check if this is the last admin
    const users = await User.findAll();
    const currentUser = await User.findById(req.params.id);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If removing admin role, check if this is the last admin
    if (currentUser.role === 'admin' && req.body.role === 'scout') {
      const adminCount = users.filter(user => user.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove admin role from the last admin user' });
      }
    }
    
    // Update user
    const user = await User.updateById(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err.message);
    
    // Handle specific errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Get all users to check if this is the last admin
    const users = await User.findAll();
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user is admin, check if it's the last admin
    if (user.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    // Can't delete yourself
    if (user.id === req.userId || user._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own user account' });
    }
    
    await User.deleteById(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    
    // Handle specific errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;