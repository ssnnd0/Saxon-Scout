const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'saxons_scouting_secret';

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Add the user ID from the token to the request object
      req.userId = decoded.userId;
      
      // Get user from database to check if they still exist and are active
      const user = await User.findById(req.userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Add full user object to request
      req.user = user;
      
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    // First run the standard auth middleware
    auth(req, res, () => {
      // Check if user is admin
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Access denied: Admin privileges required' });
      }
    });
  } catch (err) {
    console.error('Admin authentication error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { auth, adminAuth };