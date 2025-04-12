/**
 * Storage Service
 * Handles local storage with automatic encryption/decryption for sensitive data
 */
class StorageService {
  constructor() {
    this.prefix = 'saxonscouting_';
    this.sensitiveKeys = ['auth_token', 'user_data'];
  }

  // Get value from storage with optional decryption
  get(key) {
    try {
      const prefixedKey = `${this.prefix}${key}`;
      const value = localStorage.getItem(prefixedKey);
      
      if (!value) return null;
      
      // Handle encrypted sensitive data
      if (this.sensitiveKeys.includes(key)) {
        return this.decrypt(value);
      }
      
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return null;
    }
  }

  // Save value to storage with optional encryption
  save(key, value) {
    try {
      const prefixedKey = `${this.prefix}${key}`;
      
      // Handle encryption for sensitive data
      if (this.sensitiveKeys.includes(key)) {
        const encrypted = this.encrypt(value);
        localStorage.setItem(prefixedKey, encrypted);
        return;
      }
      
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving item to storage: ${key}`, error);
    }
  }

  // Remove item from storage
  remove(key) {
    try {
      const prefixedKey = `${this.prefix}${key}`;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
    }
  }

  // Clear all app-related data from storage
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }

  // Simple encryption for stored data
  // Note: This is not secure encryption, just basic obfuscation
  encrypt(data) {
    try {
      const jsonString = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(jsonString));
      return encoded;
    } catch (error) {
      console.error('Encryption error', error);
      return JSON.stringify(data);
    }
  }

  // Simple decryption for stored data
  decrypt(encryptedData) {
    try {
      const decoded = decodeURIComponent(atob(encryptedData));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Decryption error', error);
      // Fallback to just parsing JSON if decryption fails
      try {
        return JSON.parse(encryptedData);
      } catch (e) {
        return null;
      }
    }
  }

  // Methods specific to the scouting app
  
  // Save scouting data to local storage
  saveScoutingData(data) {
    this.save('scouting_data', data);
  }
  
  // Get scouting data from local storage
  getScoutingData() {
    return this.get('scouting_data') || [];
  }
  
  // Save offline matches
  saveOfflineMatches(matches) {
    this.save('offline_matches', matches);
  }
  
  // Get offline matches
  getOfflineMatches() {
    return this.get('offline_matches') || [];
  }
  
  // Save cached team data
  saveTeamData(teams) {
    this.save('team_data', teams);
  }
  
  // Get cached team data
  getTeamData() {
    return this.get('team_data') || [];
  }
  
  // Save current scouting config
  saveScoutingConfig(config) {
    this.save('scouting_config', config);
  }
  
  // Get current scouting config
  getScoutingConfig() {
    return this.get('scouting_config');
  }
  
  // Check if device is in offline mode
  isOfflineMode() {
    return this.get('offline_mode') === true;
  }
  
  // Set offline mode
  setOfflineMode(isOffline) {
    this.save('offline_mode', isOffline);
  }
}

const storageService = new StorageService();
export default storageService;