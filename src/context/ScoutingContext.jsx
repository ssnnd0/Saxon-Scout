import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create the scouting context
const ScoutingContext = createContext(undefined);

export const useScouting = () => {
  const context = useContext(ScoutingContext);
  if (context === undefined) {
    throw new Error('useScouting must be used within a ScoutingProvider');
  }
  return context;
};

export const ScoutingProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [currentSeason, setCurrentSeason] = useState(null);
  const [scoutingConfig, setScoutingConfig] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load entries from localStorage on initial render
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('scoutingEntries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (err) {
      setError('Failed to load scouting data from storage');
      console.error('Error loading scouting data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('scoutingEntries', JSON.stringify(entries));
    } catch (err) {
      setError('Failed to save scouting data to storage');
      console.error('Error saving scouting data:', err);
    }
  }, [entries]);

  // Fetch current season when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCurrentSeason = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/seasons/current');
        setCurrentSeason(res.data);
        
        // Fetch config for current season
        if (res.data && res.data._id) {
          const configRes = await axios.get(`/api/seasons/${res.data._id}/config`);
          setScoutingConfig(configRes.data);
        }
      } catch (err) {
        console.error('Error fetching current season:', err);
        setError('Failed to fetch current season.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSeason();
  }, [isAuthenticated]);

  // Fetch seasons
  const fetchSeasons = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/seasons');
      setSeasons(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching seasons:', err);
      setError('Failed to fetch seasons.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams for a specific season
  const fetchTeams = async (seasonId) => {
    if (!seasonId) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`/api/seasons/${seasonId}/teams`);
      setTeams(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to fetch teams.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch matches for a specific season
  const fetchMatches = async (seasonId) => {
    if (!seasonId) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`/api/seasons/${seasonId}/matches`);
      setMatches(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to fetch matches.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch scouting data for a specific season
  const fetchScoutingData = async (seasonId, teamNumber = null) => {
    if (!seasonId) return;
    
    try {
      setLoading(true);
      const url = teamNumber 
        ? `/api/scouting?seasonId=${seasonId}&teamNumber=${teamNumber}`
        : `/api/scouting?seasonId=${seasonId}`;
      
      const res = await axios.get(url);
      setEntries(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching scouting data:', err);
      setError('Failed to fetch scouting data.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Submit scouting entry
  const submitScoutingEntry = async (entryData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/scouting', entryData);
      
      // Update local data state with the new entry
      setEntries([...entries, res.data]);
      
      return res.data;
    } catch (err) {
      console.error('Error submitting scouting entry:', err);
      
      // If offline, store data locally for later sync
      if (!navigator.onLine) {
        const offlineEntries = JSON.parse(localStorage.getItem('saxonScoutingOfflineEntries') || '[]');
        offlineEntries.push({ ...entryData, timestamp: new Date().toISOString(), synced: false });
        localStorage.setItem('saxonScoutingOfflineEntries', JSON.stringify(offlineEntries));
        
        // Add to current data with synced=false flag
        const newEntry = { ...entryData, _id: `offline_${Date.now()}`, synced: false };
        setEntries([...entries, newEntry]);
        
        return newEntry;
      }
      
      setError('Failed to submit scouting entry.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sync offline entries when back online
  const syncOfflineEntries = async () => {
    const offlineEntries = JSON.parse(localStorage.getItem('saxonScoutingOfflineEntries') || '[]');
    if (offlineEntries.length === 0) return;
    
    try {
      setLoading(true);
      const res = await axios.post('/api/scouting/bulk', { entries: offlineEntries });
      
      // Clear offline entries on successful sync
      localStorage.removeItem('saxonScoutingOfflineEntries');
      
      // Update scouting data with newly synced entries
      const newData = entries.filter(entry => entry.synced !== false);
      setEntries([...newData, ...res.data.entries]);
      
      return res.data;
    } catch (err) {
      console.error('Error syncing offline entries:', err);
      setError('Failed to sync offline entries.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const addEntry = (entry) => {
    setError(null);
    try {
      // Generate a unique ID if one isn't provided
      const newEntry = entry.id ? entry : { ...entry, id: Date.now().toString() };
      setEntries(prevEntries => [...prevEntries, newEntry]);
    } catch (err) {
      setError('Failed to add scouting entry');
      console.error('Error adding entry:', err);
    }
  };

  const getEntriesByTeam = (teamKey) => {
    return entries.filter(entry => entry.teamKey === teamKey);
  };

  const getEntriesByEvent = (eventKey) => {
    return entries.filter(entry => entry.eventKey === eventKey);
  };

  const getEntry = (id) => {
    return entries.find(entry => entry.id === id);
  };

  const deleteEntry = (id) => {
    setError(null);
    try {
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (err) {
      setError('Failed to delete scouting entry');
      console.error('Error deleting entry:', err);
    }
  };

  const clearAllEntries = () => {
    setError(null);
    try {
      setEntries([]);
    } catch (err) {
      setError('Failed to clear scouting data');
      console.error('Error clearing entries:', err);
    }
  };

  const value = {
    currentSeason,
    scoutingConfig,
    seasons,
    teams,
    matches,
    entries,
    loading,
    error,
    fetchSeasons,
    fetchTeams,
    fetchMatches,
    fetchScoutingData,
    submitScoutingEntry,
    syncOfflineEntries,
    clearError,
    addEntry,
    getEntriesByTeam,
    getEntriesByEvent,
    getEntry,
    deleteEntry,
    clearAllEntries,
  };

  return <ScoutingContext.Provider value={value}>{children}</ScoutingContext.Provider>;
};

ScoutingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// No default export needed - we're using named exports