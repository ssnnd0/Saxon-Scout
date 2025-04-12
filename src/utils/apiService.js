/**
 * API Service
 * Handles all API calls to the backend
 */
class ApiService {
  constructor() {
    this.baseUrl = '/api';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  // Set the auth token for API requests
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // Helper methods for API calls
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      this.handleNetworkError(error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      this.handleNetworkError(error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      this.handleNetworkError(error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      this.handleNetworkError(error);
      throw error;
    }
  }

  async postFile(endpoint, file, data = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // Remove Content-Type header so browser can set it with boundary for FormData
      const headers = { ...this.headers };
      delete headers['Content-Type'];
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      this.handleNetworkError(error);
      throw error;
    }
  }

  async getBlob(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.blob();
    } catch (error) {
      this.handleNetworkError(error);
      throw error;
    }
  }

  // Error handling
  async handleError(response) {
    let errorMessage = 'An unexpected error occurred';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    
    return new Error(errorMessage);
  }

  handleNetworkError(error) {
    if (!navigator.onLine) {
      throw new Error('Network error. Please check your internet connection.');
    }
    console.error('API Error:', error);
  }

  // Authentication endpoints
  async login(username, password) {
    return this.post('/auth/login', { username, password });
  }

  async logout() {
    return this.post('/auth/logout', {});
  }

  async checkAuthStatus() {
    return this.get('/auth/status');
  }

  // User management endpoints
  async getUsers() {
    return this.get('/users');
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async addUser(userData) {
    return this.post('/users', userData);
  }

  async updateUser(userData) {
    return this.put(`/users/${userData.id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  // Scouting data endpoints
  async getCurrentSeason() {
    return this.get('/seasons/current');
  }

  async getSeasons() {
    return this.get('/seasons');
  }

  async getScoutingConfig(seasonId) {
    return this.get(`/seasons/${seasonId}/config`);
  }

  async updateScoutingConfig(config) {
    return this.put(`/seasons/${config.seasonId}/config`, config);
  }

  async getTeams(seasonId) {
    return this.get(`/seasons/${seasonId}/teams`);
  }

  async getMatches(seasonId) {
    return this.get(`/seasons/${seasonId}/matches`);
  }

  async saveScoutingEntry(entry) {
    return this.post('/scouting', entry);
  }

  async bulkSyncScoutingData(entries) {
    return this.post('/scouting/bulk', { entries });
  }

  async getScoutingData(seasonId, teamNumber = null) {
    let endpoint = `/scouting?seasonId=${seasonId}`;
    if (teamNumber) {
      endpoint += `&teamNumber=${teamNumber}`;
    }
    return this.get(endpoint);
  }

  async getScoutingDataStats() {
    return this.get('/scouting/stats');
  }

  async exportScoutingData(seasonId, format = 'csv') {
    return this.getBlob(`/scouting/export/${seasonId}?format=${format}`);
  }

  async importScoutingData(file, seasonId, format = 'csv') {
    return this.postFile('/scouting/import', file, { seasonId, format });
  }

  async clearScoutingData(seasonId) {
    return this.delete(`/scouting/${seasonId}`);
  }

  async importTeams(file, seasonId, format = 'csv') {
    return this.postFile(`/seasons/${seasonId}/teams/import`, file, { format });
  }
}

const apiService = new ApiService();
export default apiService;