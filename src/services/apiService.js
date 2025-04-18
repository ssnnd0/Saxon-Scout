const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';
const FRC_BASE_URL = 'https://frc-api.firstinspires.org/v3.0';

// API service for The Blue Alliance
export const tbaApi = {
  // Helper function for TBA API requests
  request: async (endpoint) => {
    try {
      const response = await fetch(`${TBA_BASE_URL}${endpoint}`, {
        headers: {
          'X-TBA-Auth-Key': import.meta.env.VITE_BLUE_ALLIANCE_API_KEY,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  // Get team information
  getTeam: async (teamNumber) => {
    return tbaApi.request(`/team/frc${teamNumber}`);
  },
  
  // Get team events for a specific year
  getTeamEvents: async (teamNumber, year) => {
    return tbaApi.request(`/team/frc${teamNumber}/events/${year}`);
  },
  
  // Get team matches at an event
  getTeamEventMatches: async (teamNumber, eventKey) => {
    return tbaApi.request(`/team/frc${teamNumber}/event/${eventKey}/matches`);
  },
  
  // Get team status at an event
  getTeamEventStatus: async (teamNumber, eventKey) => {
    return tbaApi.request(`/team/frc${teamNumber}/event/${eventKey}/status`);
  },
  
  // Get events for a specific year
  getEvents: async (year) => {
    return tbaApi.request(`/events/${year}`);
  },
  
  // Get matches for a specific event
  getEventMatches: async (eventKey) => {
    return tbaApi.request(`/event/${eventKey}/matches`);
  },
  
  // Get teams at a specific event
  getEventTeams: async (eventKey) => {
    return tbaApi.request(`/event/${eventKey}/teams`);
  },
};

// API service for FRC Events API
export const frcApi = {
  // Helper function for FRC API requests
  request: async (endpoint, year) => {
    try {
      const response = await fetch(`${FRC_BASE_URL}/${year}${endpoint}`, {
        headers: {
          'Authorization': `Basic ${import.meta.env.VITE_FRC_EVENT_API_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  // Get additional event details
  getEventDetails: async (eventCode, year) => {
    return frcApi.request(`/events/${eventCode}`, year);
  },
  
  // Get event rankings
  getEventRankings: async (eventCode, year) => {
    return frcApi.request(`/rankings/${eventCode}`, year);
  },
  
  // Get event schedule
  getEventSchedule: async (eventCode, year, tournamentLevel = 'qual') => {
    return frcApi.request(`/schedule/${eventCode}/${tournamentLevel}`, year);
  },
}; 