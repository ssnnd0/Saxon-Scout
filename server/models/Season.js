const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { useLocalDB, readLocalData, writeLocalData, seasonsPath } = require('../config/db');

// Season schema for MongoDB
const SeasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  teams: [{
    number: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: String,
    website: String,
    rookieYear: Number
  }],
  matches: [{
    number: {
      type: String,
      required: true
    },
    time: Date,
    redAlliance: [String],
    blueAlliance: [String],
    redScore: Number,
    blueScore: Number
  }],
  scoutingConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

// Create the model if using MongoDB
const MongoSeason = useLocalDB ? null : mongoose.model('Season', SeasonSchema);

// Season class for JSON file storage
class LocalSeason {
  static async create(seasonData) {
    const seasons = readLocalData(seasonsPath);
    
    // If this season is set as current, update all other seasons
    if (seasonData.isCurrent) {
      seasons.forEach(season => {
        season.isCurrent = false;
      });
    }
    
    // Create new season with unique ID
    const newSeason = {
      id: uuidv4(),
      name: seasonData.name,
      year: seasonData.year,
      isCurrent: seasonData.isCurrent || false,
      startDate: seasonData.startDate,
      endDate: seasonData.endDate,
      gameName: seasonData.gameName,
      teams: seasonData.teams || [],
      matches: seasonData.matches || [],
      scoutingConfig: seasonData.scoutingConfig || null
    };
    
    seasons.push(newSeason);
    writeLocalData(seasonsPath, seasons);
    
    return newSeason;
  }

  static async findById(id) {
    const seasons = readLocalData(seasonsPath);
    return seasons.find(season => season.id === id) || null;
  }

  static async findAll() {
    return readLocalData(seasonsPath);
  }

  static async findCurrent() {
    const seasons = readLocalData(seasonsPath);
    return seasons.find(season => season.isCurrent) || null;
  }

  static async updateById(id, updateData) {
    const seasons = readLocalData(seasonsPath);
    const seasonIndex = seasons.findIndex(season => season.id === id);
    
    if (seasonIndex === -1) {
      const error = new Error('Season not found');
      error.statusCode = 404;
      throw error;
    }
    
    // If setting this season as current, update all other seasons
    if (updateData.isCurrent) {
      seasons.forEach((season, index) => {
        if (index !== seasonIndex) {
          season.isCurrent = false;
        }
      });
    }
    
    // Update season data
    seasons[seasonIndex] = { ...seasons[seasonIndex], ...updateData };
    writeLocalData(seasonsPath, seasons);
    
    return seasons[seasonIndex];
  }

  static async deleteById(id) {
    const seasons = readLocalData(seasonsPath);
    const seasonIndex = seasons.findIndex(season => season.id === id);
    
    if (seasonIndex === -1) {
      const error = new Error('Season not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Remove season
    seasons.splice(seasonIndex, 1);
    writeLocalData(seasonsPath, seasons);
    return true;
  }

  static async updateScoutingConfig(id, config) {
    const seasons = readLocalData(seasonsPath);
    const seasonIndex = seasons.findIndex(season => season.id === id);
    
    if (seasonIndex === -1) {
      const error = new Error('Season not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Update config
    seasons[seasonIndex].scoutingConfig = config;
    writeLocalData(seasonsPath, seasons);
    
    return seasons[seasonIndex];
  }

  static async getScoutingConfig(id) {
    const season = await this.findById(id);
    if (!season) {
      const error = new Error('Season not found');
      error.statusCode = 404;
      throw error;
    }
    
    return season.scoutingConfig;
  }

  static async addTeams(id, teams) {
    const seasons = readLocalData(seasonsPath);
    const seasonIndex = seasons.findIndex(season => season.id === id);
    
    if (seasonIndex === -1) {
      const error = new Error('Season not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Merge teams with existing ones (replacing duplicates by team number)
    const existingTeams = seasons[seasonIndex].teams || [];
    const teamNumberMap = {};
    
    // Create a map of existing teams by number
    existingTeams.forEach(team => {
      teamNumberMap[team.number] = team;
    });
    
    // Update or add new teams
    teams.forEach(team => {
      teamNumberMap[team.number] = team;
    });
    
    // Convert map back to array
    seasons[seasonIndex].teams = Object.values(teamNumberMap);
    writeLocalData(seasonsPath, seasons);
    
    return seasons[seasonIndex].teams;
  }

  static async addMatches(id, matches) {
    const seasons = readLocalData(seasonsPath);
    const seasonIndex = seasons.findIndex(season => season.id === id);
    
    if (seasonIndex === -1) {
      const error = new Error('Season not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Merge matches with existing ones (replacing duplicates by match number)
    const existingMatches = seasons[seasonIndex].matches || [];
    const matchNumberMap = {};
    
    // Create a map of existing matches by number
    existingMatches.forEach(match => {
      matchNumberMap[match.number] = match;
    });
    
    // Update or add new matches
    matches.forEach(match => {
      matchNumberMap[match.number] = match;
    });
    
    // Convert map back to array
    seasons[seasonIndex].matches = Object.values(matchNumberMap);
    writeLocalData(seasonsPath, seasons);
    
    return seasons[seasonIndex].matches;
  }
}

// Export appropriate Season model based on database type
module.exports = useLocalDB ? LocalSeason : MongoSeason;