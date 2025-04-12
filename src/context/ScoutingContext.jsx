import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create the scouting context
export const ScoutingContext = createContext();

export const useScouting = () => useContext(ScoutingContext);

export const ScoutingProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [currentSeason, setCurrentSeason] = useState(null);
  const [scoutingConfig, setScoutingConfig] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [scoutingData, setScoutingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setScoutingData(res.data);
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
      setScoutingData([...scoutingData, res.data]);
      
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
        setScoutingData([...scoutingData, newEntry]);
        
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
      const newData = scoutingData.filter(entry => entry.synced !== false);
      setScoutingData([...newData, ...res.data.entries]);
      
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

  return (
    <ScoutingContext.Provider
      value={{
        currentSeason,
        scoutingConfig,
        seasons,
        teams,
        matches,
        scoutingData,
        loading,
        error,
        fetchSeasons,
        fetchTeams,
        fetchMatches,
        fetchScoutingData,
        submitScoutingEntry,
        syncOfflineEntries,
        clearError,
      }}
    >
      {children}
    </ScoutingContext.Provider>
  );
};

ScoutingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// No default export needed - we're using named exports