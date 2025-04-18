import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScouting } from '../context/ScoutingContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart, CartesianGrid, Legend, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { theme } = useTheme();
  const { entries, loading: scoutingLoading, error: scoutingError, currentSeason } = useScouting();
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [teamPerformanceData, setTeamPerformanceData] = useState([]);
  const [scoutingEntries, setScoutingEntries] = useState([]);
  const [currentSeasonData, setCurrentSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEntries: 0,
    teamsScoutedCount: 0,
    pendingSync: 0,
    recentEntries: []
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch team performance data
        const performanceData = await apiService.getTeamPerformanceData();
        setTeamPerformanceData(performanceData);
        
        // Fetch scouting entries if not provided by context
        if (!entries || entries.length === 0) {
          const entriesData = await apiService.getScoutingEntries();
          setScoutingEntries(entriesData);
        }
        
        // Fetch current season if not provided by context
        if (!currentSeason) {
          const seasonData = await apiService.getCurrentSeason();
          setCurrentSeasonData(seasonData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [entries, currentSeason]);

  // Calculate stats from scouting data
  useEffect(() => {
    const entriesData = entries && entries.length > 0 ? entries : scoutingEntries;
    
    if (entriesData && entriesData.length > 0) {
      const uniqueTeams = new Set(entriesData.map(entry => entry.teamKey || entry.teamNumber));
      const unsyncedEntries = entriesData.filter(entry => entry.synced === false);
      const recentEntriesList = [...entriesData].sort((a, b) => {
        const dateA = new Date(a.timestamp || a.createdAt || 0);
        const dateB = new Date(b.timestamp || b.createdAt || 0);
        return dateB - dateA;
      }).slice(0, 5);

      setStats({
        totalEntries: entriesData.length,
        teamsScoutedCount: uniqueTeams.size,
        pendingSync: unsyncedEntries.length,
        recentEntries: recentEntriesList
      });
    }
  }, [entries, scoutingEntries]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setNetworkStatus(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Get team number from environment variables
  const teamNumber = import.meta.env.VITE_TEAM_NUMBER || '611';
  
  if (loading || scoutingLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const displayError = error || scoutingError;
  const displayCurrentSeason = currentSeason || currentSeasonData;
  const displayEntries = entries && entries.length > 0 ? entries : scoutingEntries;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          {displayCurrentSeason && (
            <p className="text-text-secondary mt-1">
              Current Season: <span className="text-primary-600">{displayCurrentSeason.name}</span>
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${networkStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-text-secondary">{networkStatus ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {displayError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {displayError}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <div className="text-center">
            <h3 className="text-lg text-text-secondary">Matches Scouted</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalEntries}</p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="text-center">
            <h3 className="text-lg text-text-secondary">Teams Covered</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{stats.teamsScoutedCount}</p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="text-center">
            <h3 className="text-lg text-text-secondary">Pending Sync</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{stats.pendingSync}</p>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="autoPoints" name="Auto" fill="#6366f1" />
              <Bar dataKey="teleopPoints" name="Teleop" fill="#8b5cf6" />
              <Bar dataKey="endgamePoints" name="Endgame" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col space-y-3">
            <Link
              to="/scouting-form"
              className="btn btn-primary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              New Scouting Entry
            </Link>
            
            <Link
              to="/team-performance"
              className="btn btn-secondary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Team Performance
            </Link>
            
            <Link
              to={`/team-${teamNumber}`}
              className="btn btn-secondary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Team {teamNumber} Profile
            </Link>
            
            {stats.pendingSync > 0 && (
              <button 
                className="btn btn-warning flex items-center justify-center"
                disabled={!networkStatus}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {`Sync Data (${stats.pendingSync})`}
              </button>
            )}
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {stats.recentEntries && stats.recentEntries.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEntries.map((entry, index) => (
                <div key={entry.id || `entry-${index}`} className="flex items-center justify-between bg-primary-50 p-3 rounded-md">
                  <div>
                    <p className="font-medium">Team {entry.teamNumber || entry.teamKey?.replace('frc', '')}</p>
                    <p className="text-sm text-text-secondary">
                      {entry.matchNumber ? `Match ${entry.matchNumber}` : 'Practice'} - 
                      {entry.synced === false ? ' Not Synced' : ' Synced'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${entry.synced === false ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-secondary">No scouting entries yet</p>
              <Link to="/scouting-form" className="btn btn-primary mt-4">Create First Entry</Link>
            </div>
          )}
        </div>
      </div>

      {/* Teams Overview */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Teams</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {teamPerformanceData.map((team) => (
            <div key={team.team} className="bg-primary-50 rounded p-3 text-center">
              <p className="font-bold">{team.team}</p>
              <p className="text-sm text-text-secondary">Total: {team.autoPoints + team.teleopPoints + team.endgamePoints}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">First-Time Setup Guide</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Step 1: Configure your team</h3>
              <p className="text-text-secondary mt-1">Set up your team information and customize your scouting form.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Step 2: Add members</h3>
              <p className="text-text-secondary mt-1">Invite team members to collaborate on scouting data collection.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Step 3: Start scouting</h3>
              <p className="text-text-secondary mt-1">Begin collecting data at your next competition or event.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;