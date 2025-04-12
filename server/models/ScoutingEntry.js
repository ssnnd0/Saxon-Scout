const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { useLocalDB, readLocalData, writeLocalData, scoutingEntriesPath } = require('../config/db');

// ScoutingEntry schema for MongoDB
const ScoutingEntrySchema = new mongoose.Schema({
  teamNumber: {
    type: String,
    required: true,
    trim: true
  },
  matchNumber: {
    type: String,
    required: true,
    trim: true
  },
  alliance: {
    type: String,
    enum: ['red', 'blue'],
    required: true
  },
  scoutName: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  seasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true
  },
  synced: {
    type: Boolean,
    default: true
  },
  // Dynamic fields will vary based on the season's scouting configuration
  // These will be stored as a mixed type object
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Create compound index for season, team and match
ScoutingEntrySchema.index({ seasonId: 1, teamNumber: 1, matchNumber: 1 });

// Create the model if using MongoDB
const MongoScoutingEntry = useLocalDB ? null : mongoose.model('ScoutingEntry', ScoutingEntrySchema);

// ScoutingEntry class for JSON file storage
class LocalScoutingEntry {
  static async create(entryData) {
    const entries = readLocalData(scoutingEntriesPath);
    
    // Create new entry with unique ID
    const newEntry = {
      id: entryData.id || uuidv4(),
      teamNumber: entryData.teamNumber,
      matchNumber: entryData.matchNumber,
      alliance: entryData.alliance,
      scoutName: entryData.scoutName,
      timestamp: entryData.timestamp || new Date().toISOString(),
      seasonId: entryData.seasonId,
      synced: true,
      ...entryData // Include all other fields from the form
    };
    
    entries.push(newEntry);
    writeLocalData(scoutingEntriesPath, entries);
    
    return newEntry;
  }

  static async bulkCreate(entriesArray) {
    const existingEntries = readLocalData(scoutingEntriesPath);
    const newEntries = [];
    
    for (const entry of entriesArray) {
      const newEntry = {
        id: entry.id || uuidv4(),
        teamNumber: entry.teamNumber,
        matchNumber: entry.matchNumber,
        alliance: entry.alliance,
        scoutName: entry.scoutName,
        timestamp: entry.timestamp || new Date().toISOString(),
        seasonId: entry.seasonId,
        synced: true,
        ...entry
      };
      
      newEntries.push(newEntry);
    }
    
    const updatedEntries = [...existingEntries, ...newEntries];
    writeLocalData(scoutingEntriesPath, updatedEntries);
    
    return newEntries;
  }

  static async findBySeasonId(seasonId) {
    const entries = readLocalData(scoutingEntriesPath);
    return entries.filter(entry => entry.seasonId === seasonId);
  }

  static async findByTeam(seasonId, teamNumber) {
    const entries = readLocalData(scoutingEntriesPath);
    return entries.filter(entry => 
      entry.seasonId === seasonId && 
      entry.teamNumber === teamNumber
    );
  }

  static async findByMatch(seasonId, matchNumber) {
    const entries = readLocalData(scoutingEntriesPath);
    return entries.filter(entry => 
      entry.seasonId === seasonId && 
      entry.matchNumber === matchNumber
    );
  }

  static async deleteBySeasonId(seasonId) {
    const entries = readLocalData(scoutingEntriesPath);
    const filteredEntries = entries.filter(entry => entry.seasonId !== seasonId);
    writeLocalData(scoutingEntriesPath, filteredEntries);
    return true;
  }

  static async getStats() {
    const entries = readLocalData(scoutingEntriesPath);
    
    // Get unique team numbers across all entries
    const teams = new Set();
    entries.forEach(entry => teams.add(entry.teamNumber));
    
    // Get latest timestamp
    let lastUpdated = null;
    if (entries.length > 0) {
      const timestamps = entries.map(entry => new Date(entry.timestamp).getTime());
      lastUpdated = new Date(Math.max(...timestamps)).toISOString();
    }
    
    return {
      totalMatches: entries.length,
      totalTeams: teams.size,
      dataPoints: entries.length * 10, // Approximate data points per entry
      lastUpdated
    };
  }
}

// Export appropriate ScoutingEntry model based on database type
module.exports = useLocalDB ? LocalScoutingEntry : MongoScoutingEntry;