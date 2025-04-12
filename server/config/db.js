const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/saxons_scouting';

// Path for local database storage if using local JSON
const dbPath = path.join(__dirname, '../data');
const usersPath = path.join(dbPath, 'users.json');
const scoutingEntriesPath = path.join(dbPath, 'scouting_entries.json');
const seasonsPath = path.join(dbPath, 'seasons.json');

// Flag to use local JSON storage instead of MongoDB 
// (useful for development without MongoDB)
const useLocalDB = process.env.USE_LOCAL_DB === 'true' || false;

// Connect to MongoDB
const connectDB = async () => {
  if (useLocalDB) {
    console.log('Using local JSON files for data storage');
    // Ensure data directory exists
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
    
    // Create empty JSON files if they don't exist
    if (!fs.existsSync(usersPath)) {
      fs.writeFileSync(usersPath, JSON.stringify([]));
    }
    if (!fs.existsSync(scoutingEntriesPath)) {
      fs.writeFileSync(scoutingEntriesPath, JSON.stringify([]));
    }
    if (!fs.existsSync(seasonsPath)) {
      fs.writeFileSync(seasonsPath, JSON.stringify([]));
    }
    
    return;
  }
  
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Read data from local JSON files
const readLocalData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading from ${filePath}:`, err);
    return [];
  }
};

// Write data to local JSON files
const writeLocalData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    return false;
  }
};

module.exports = { 
  connectDB, 
  useLocalDB,
  readLocalData,
  writeLocalData,
  usersPath,
  scoutingEntriesPath,
  seasonsPath
};