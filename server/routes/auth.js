const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'saxons_scouting_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = User.comparePassword 
      ? await User.comparePassword(user, password)  // for Local storage
      : await user.comparePassword(password);       // for MongoDB
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    if (User.updateLoginTime) {
      await User.updateLoginTime(user.id);
    } else if (user.lastLogin) {
      user.lastLogin = Date.now();
      await user.save();
    }

    // Create and sign JWT
    const payload = {
      userId: user.id || user._id,
      username: user.username,
      role: user.role
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        
        // Get user object without password
        const safeUser = User.toJSON ? User.toJSON(user) : user;
        if (safeUser.password) delete safeUser.password;
        
        res.json({
          token,
          user: safeUser
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/status
// @desc    Get authenticated user
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Return user data without password
    const safeUser = User.toJSON ? User.toJSON(user) : user;
    if (safeUser.password) delete safeUser.password;
    
    res.json(safeUser);
  } catch (err) {
    console.error('Auth status error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/logout
// @desc    Logout user (client-side only, just for consistency)
// @access  Private
router.post('/logout', auth, (req, res) => {
  try {
    // This is mostly handled client-side by removing the token
    // Here we just acknowledge the logout
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;