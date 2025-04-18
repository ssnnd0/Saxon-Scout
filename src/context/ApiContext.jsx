import { createContext, useState, useContext } from 'react';
import { tbaApi, frcApi } from '../services/apiService';

const ApiContext = createContext(undefined);

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic wrapper for API calls to handle loading and errors
  const apiWrapper = async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // TBA API methods
  const getTeam = (teamNumber) => {
    return apiWrapper(() => tbaApi.getTeam(teamNumber));
  };

  const getTeamEvents = (teamNumber, year) => {
    return apiWrapper(() => tbaApi.getTeamEvents(teamNumber, year));
  };

  const getTeamEventMatches = (teamNumber, eventKey) => {
    return apiWrapper(() => tbaApi.getTeamEventMatches(teamNumber, eventKey));
  };

  const getTeamEventStatus = (teamNumber, eventKey) => {
    return apiWrapper(() => tbaApi.getTeamEventStatus(teamNumber, eventKey));
  };

  const getEvents = (year) => {
    return apiWrapper(() => tbaApi.getEvents(year));
  };

  const getEventMatches = (eventKey) => {
    return apiWrapper(() => tbaApi.getEventMatches(eventKey));
  };

  const getEventTeams = (eventKey) => {
    return apiWrapper(() => tbaApi.getEventTeams(eventKey));
  };

  // FRC API methods
  const getEventDetails = (eventCode, year) => {
    return apiWrapper(() => frcApi.getEventDetails(eventCode, year));
  };

  const getEventRankings = (eventCode, year) => {
    return apiWrapper(() => frcApi.getEventRankings(eventCode, year));
  };

  const getEventSchedule = (eventCode, year, tournamentLevel = 'qual') => {
    return apiWrapper(() => frcApi.getEventSchedule(eventCode, year, tournamentLevel));
  };

  const value = {
    loading,
    error,
    getTeam,
    getTeamEvents,
    getTeamEventMatches,
    getTeamEventStatus,
    getEvents,
    getEventMatches,
    getEventTeams,
    getEventDetails,
    getEventRankings,
    getEventSchedule,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}; 