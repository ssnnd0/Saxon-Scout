const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { useLocalDB, readLocalData, writeLocalData, usersPath } = require('../config/db');

// User schema for MongoDB
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'scout'],
    default: 'scout'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to return user JSON without the password
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create the model if using MongoDB
const MongoUser = useLocalDB ? null : mongoose.model('User', UserSchema);

// User class for JSON file storage
class LocalUser {
  static async findByUsername(username) {
    const users = readLocalData(usersPath);
    return users.find(user => user.username === username) || null;
  }

  static async findById(id) {
    const users = readLocalData(usersPath);
    return users.find(user => user.id === id) || null;
  }

  static async create(userData) {
    const users = readLocalData(usersPath);
    
    // Check if username already exists
    if (users.find(user => user.username === userData.username)) {
      const error = new Error('Username already exists');
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      username: userData.username,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'scout',
      dateCreated: new Date().toISOString(),
      lastLogin: null
    };
    
    users.push(newUser);
    writeLocalData(usersPath, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async updateById(id, updateData) {
    const users = readLocalData(usersPath);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Update user data
    const updatedUser = { ...users[userIndex], ...updateData };
    
    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(updateData.password, salt);
    }
    
    users[userIndex] = updatedUser;
    writeLocalData(usersPath, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async deleteById(id) {
    const users = readLocalData(usersPath);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Remove user
    users.splice(userIndex, 1);
    writeLocalData(usersPath, users);
    return true;
  }

  static async comparePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static async findAll() {
    const users = readLocalData(usersPath);
    // Return users without passwords
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  static async updateLoginTime(id) {
    const users = readLocalData(usersPath);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString();
      writeLocalData(usersPath, users);
    }
  }
}

// Export appropriate User model based on database type
module.exports = useLocalDB ? LocalUser : MongoUser;