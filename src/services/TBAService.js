import axios from 'axios';

// Replace with your TBA API key
const TBA_API_KEY = 'YOUR_TBA_API_KEY';
const BASE_URL = 'https://www.thebluealliance.com/api/v3';

// Configure axios instance for TBA API
const tbaApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-TBA-Auth-Key': TBA_API_KEY,
  },
});

// Error handling middleware
tbaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TBA API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

const TBAService = {
  // Get basic team info
  getTeam: async (teamNumber) => {
    try {
      const response = await tbaApi.get(`/team/frc${teamNumber}`);
      return response.data;
    } catch (error) {
      // For development/demo purposes, return mock data if API key not set
      if (!TBA_API_KEY || TBA_API_KEY === 'YOUR_TBA_API_KEY') {
        console.warn('Using mock data for team', teamNumber);
        return mockTeamData(teamNumber);
      }
      throw error;
    }
  },

  // Get team events for a specific year
  getTeamEvents: async (teamNumber, year = new Date().getFullYear()) => {
    try {
      const response = await tbaApi.get(`/team/frc${teamNumber}/events/${year}`);
      return response.data;
    } catch (error) {
      // For development/demo purposes, return mock data if API key not set
      if (!TBA_API_KEY || TBA_API_KEY === 'YOUR_TBA_API_KEY') {
        console.warn('Using mock events data for team', teamNumber);
        return mockTeamEvents(teamNumber, year);
      }
      throw error;
    }
  },

  // Get team matches at a specific event
  getTeamEventMatches: async (teamNumber, eventKey) => {
    try {
      const response = await tbaApi.get(`/team/frc${teamNumber}/event/${eventKey}/matches`);
      return response.data;
    } catch (error) {
      // For development/demo purposes, return mock data if API key not set
      if (!TBA_API_KEY || TBA_API_KEY === 'YOUR_TBA_API_KEY') {
        console.warn('Using mock match data for team', teamNumber);
        return mockTeamMatches(teamNumber, eventKey);
      }
      throw error;
    }
  },

  // Get event details
  getEvent: async (eventKey) => {
    try {
      const response = await tbaApi.get(`/event/${eventKey}`);
      return response.data;
    } catch (error) {
      // For development/demo purposes, return mock data if API key not set
      if (!TBA_API_KEY || TBA_API_KEY === 'YOUR_TBA_API_KEY') {
        console.warn('Using mock event data for', eventKey);
        return mockEvent(eventKey);
      }
      throw error;
    }
  },

  // Get all matches for an event
  getEventMatches: async (eventKey) => {
    try {
      const response = await tbaApi.get(`/event/${eventKey}/matches`);
      return response.data;
    } catch (error) {
      // For development/demo purposes, return mock data if API key not set
      if (!TBA_API_KEY || TBA_API_KEY === 'YOUR_TBA_API_KEY') {
        console.warn('Using mock matches data for event', eventKey);
        return mockEventMatches(eventKey);
      }
      throw error;
    }
  },

  // Search for teams
  searchTeams: async (query) => {
    try {
      // TBA doesn't have a direct search endpoint, so we'll get all teams and filter
      const year = new Date().getFullYear();
      const response = await tbaApi.get(`/teams/${year}`);
      
      // Filter teams by number or name containing the query
      const queryLower = query.toLowerCase();
      return response.data.filter(team => 
        team.team_number.toString().includes(query) || 
        (team.nickname && team.nickname.toLowerCase().includes(queryLower))
      );
    } catch (error) {
      // For development/demo purposes, return mock data if API key not set
      if (!TBA_API_KEY || TBA_API_KEY === 'YOUR_TBA_API_KEY') {
        console.warn('Using mock search results for', query);
        return mockTeamSearch(query);
      }
      throw error;
    }
  }
};

// Mock data functions for development
function mockTeamData(teamNumber) {
  // Create some variation based on team number
  const cityIndex = teamNumber % mockCities.length;
  const stateIndex = teamNumber % mockStates.length;
  
  return {
    team_number: parseInt(teamNumber),
    key: `frc${teamNumber}`,
    nickname: `Team ${teamNumber}`,
    name: `Team ${teamNumber} High School & Sponsors`,
    city: mockCities[cityIndex],
    state_prov: mockStates[stateIndex],
    country: "USA",
    rookie_year: 2000 + (teamNumber % 23),
    website: `https://team${teamNumber}.org`
  };
}

function mockTeamEvents(teamNumber, year) {
  // Generate 2-4 mock events
  const numEvents = 2 + (teamNumber % 3);
  const events = [];
  
  for (let i = 0; i < numEvents; i++) {
    const eventCode = String.fromCharCode(97 + i); // a, b, c, ...
    events.push({
      key: `${year}${eventCode}`,
      name: `${mockCities[i % mockCities.length]} Regional`,
      event_code: eventCode,
      event_type: 0,
      start_date: `${year}-03-${10 + i * 7}`,
      end_date: `${year}-03-${12 + i * 7}`,
      year: year,
      location_name: `${mockCities[i % mockCities.length]} Convention Center`
    });
  }
  
  return events;
}

function mockTeamMatches(teamNumber, eventKey) {
  const matches = [];
  const year = parseInt(eventKey.substring(0, 4));
  
  // Generate 8-12 mock matches
  const numMatches = 8 + (teamNumber % 5);
  
  for (let i = 1; i <= numMatches; i++) {
    const isBlueAlliance = i % 2 === 0;
    const match = {
      key: `${eventKey}_qm${i}`,
      comp_level: "qm",
      set_number: 1,
      match_number: i,
      alliances: {
        blue: {
          score: Math.floor(Math.random() * 100) + 50,
          team_keys: ["frc1", "frc2", "frc3"]
        },
        red: {
          score: Math.floor(Math.random() * 100) + 50,
          team_keys: ["frc4", "frc5", "frc6"]
        }
      },
      winning_alliance: Math.random() > 0.5 ? "blue" : "red",
      event_key: eventKey,
      time: Date.now() / 1000 + i * 600,
      actual_time: Date.now() / 1000 - (numMatches - i) * 600
    };
    
    // Place the team in the appropriate alliance
    if (isBlueAlliance) {
      match.alliances.blue.team_keys[0] = `frc${teamNumber}`;
    } else {
      match.alliances.red.team_keys[0] = `frc${teamNumber}`;
    }
    
    matches.push(match);
  }
  
  return matches;
}

function mockEvent(eventKey) {
  const year = parseInt(eventKey.substring(0, 4));
  const eventCode = eventKey.substring(4);
  const eventIndex = eventCode.charCodeAt(0) - 97;
  
  return {
    key: eventKey,
    name: `${mockCities[eventIndex % mockCities.length]} Regional`,
    event_code: eventCode,
    event_type: 0,
    district: null,
    city: mockCities[eventIndex % mockCities.length],
    state_prov: mockStates[eventIndex % mockStates.length],
    country: "USA",
    start_date: `${year}-03-${10 + eventIndex * 7}`,
    end_date: `${year}-03-${12 + eventIndex * 7}`,
    year: year
  };
}

function mockEventMatches(eventKey) {
  const matches = [];
  
  // Generate 30-40 mock matches
  const numMatches = 30 + (eventKey.charCodeAt(4) % 10);
  
  for (let i = 1; i <= numMatches; i++) {
    const blueScore = Math.floor(Math.random() * 100) + 50;
    const redScore = Math.floor(Math.random() * 100) + 50;
    
    matches.push({
      key: `${eventKey}_qm${i}`,
      comp_level: "qm",
      set_number: 1,
      match_number: i,
      alliances: {
        blue: {
          score: blueScore,
          team_keys: [
            `frc${100 + i * 3}`,
            `frc${101 + i * 3}`,
            `frc${102 + i * 3}`
          ]
        },
        red: {
          score: redScore,
          team_keys: [
            `frc${200 + i * 3}`,
            `frc${201 + i * 3}`,
            `frc${202 + i * 3}`
          ]
        }
      },
      winning_alliance: blueScore > redScore ? "blue" : (redScore > blueScore ? "red" : ""),
      event_key: eventKey,
      time: Date.now() / 1000 + i * 600,
      actual_time: Date.now() / 1000 - (numMatches - i) * 600
    });
  }
  
  return matches;
}

function mockTeamSearch(query) {
  const results = [];
  const queryNum = parseInt(query);
  
  // If query is a number, include teams close to that number
  if (!isNaN(queryNum)) {
    for (let i = 0; i < 5; i++) {
      const teamNum = queryNum + i;
      results.push(mockTeamData(teamNum));
    }
  } else {
    // Generate some random teams
    for (let i = 1; i <= 10; i++) {
      const teamNum = 1000 + i * 100;
      const team = mockTeamData(teamNum);
      // Add query to nickname to simulate matching
      team.nickname = `${query} ${team.nickname}`;
      results.push(team);
    }
  }
  
  return results;
}

const mockCities = ["Chicago", "Boston", "Detroit", "St. Louis", "Houston", "Seattle", "Miami", "Phoenix", "Denver", "Atlanta"];
const mockStates = ["Illinois", "Massachusetts", "Michigan", "Missouri", "Texas", "Washington", "Florida", "Arizona", "Colorado", "Georgia"];

export default TBAService; 