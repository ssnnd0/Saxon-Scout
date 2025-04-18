import axios from 'axios';

// API base URL from environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030';

/**
 * API service for making requests to the backend
 */
class ApiService {
  /**
   * Get all teams
   * @returns {Promise<Array>} List of all teams
   */
  async getTeams() {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch teams");
    }
  }

  /**
   * Get data for a specific team by team number
   * @param {string} teamNumber - The team number to fetch
   * @returns {Promise<object>} Team data or error
   */
  async getTeamData(teamNumber) {
    try {
      const response = await axios.get(`${API_URL}/teamData/${teamNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for team ${teamNumber}:`, error);
      throw new Error(error.response?.data?.message || `Failed to fetch data for team ${teamNumber}`);
    }
  }

  /**
   * Get performance data for all teams
   * @returns {Promise<Array>} Performance data for all teams
   */
  async getTeamPerformanceData() {
    try {
      const response = await axios.get(`${API_URL}/teamPerformanceData`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching team performance data: ${error.message}`);
    }
  }

  /**
   * Get all scouting entries
   * @returns {Promise<Array>} All scouting entries
   */
  async getScoutingEntries() {
    try {
      const response = await axios.get(`${API_URL}/scoutingEntries`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching scouting entries: ${error.message}`);
    }
  }

  /**
   * Get current season data
   * @returns {Promise<object>} Current season data
   */
  async getCurrentSeason() {
    try {
      const response = await axios.get(`${API_URL}/currentSeason`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching current season: ${error.message}`);
    }
  }

  /**
   * Add a new scouting entry
   * @param {object} entry - The entry to add
   * @returns {Promise<object>} The added entry with an ID
   */
  async addScoutingEntry(entry) {
    try {
      const response = await axios.post(`${API_URL}/scoutingEntries`, {
        ...entry,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error adding scouting entry: ${error.message}`);
    }
  }
}

export default new ApiService(); 