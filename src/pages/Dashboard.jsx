import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { AuthContext } from '../context/AuthContext';
import { ScoutingContext } from '../context/ScoutingContext';

const Dashboard = () => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const { 
    currentSeason, 
    scoutingData, 
    teams, 
    loading, 
    error, 
    syncScoutingData 
  } = useContext(ScoutingContext);
  
  const [syncStatus, setSyncStatus] = useState({ loading: false, success: false, error: null });
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

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

  // Calculate stats from scouting data
  const stats = {
    totalMatches: scoutingData.length,
    teamsScoutedCount: new Set(scoutingData.map(entry => entry.teamNumber)).size,
    unsyncedCount: scoutingData.filter(entry => !entry.synced).length,
    recentEntries: scoutingData.slice(-5).reverse()
  };

  const handleSync = async () => {
    if (!networkStatus) {
      setSyncStatus({
        loading: false,
        success: false,
        error: 'Cannot sync while offline'
      });
      return;
    }

    setSyncStatus({ loading: true, success: false, error: null });
    
    try {
      const result = await syncScoutingData();
      setSyncStatus({
        loading: false,
        success: result,
        error: result ? null : 'Failed to sync data'
      });
      
      // Clear success message after 3 seconds
      if (result) {
        setTimeout(() => {
          setSyncStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      }
    } catch (err) {
      setSyncStatus({
        loading: false,
        success: false,
        error: err.message
      });
    }
  };

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          {currentSeason && (
            <p className="text-gray-400 mt-1">
              Current Season: <span className="text-blue-400">{currentSeason.name}</span>
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${networkStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-400">{networkStatus ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Matches Scouted</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalMatches}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Teams Covered</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">{stats.teamsScoutedCount}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Pending Sync</h3>
            <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.unsyncedCount}</p>
          </div>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Quick Actions">
          <div className="flex flex-col space-y-3">
            <Link to="/scouting">
              <Button variant="primary" fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                New Scouting Entry
              </Button>
            </Link>
            
            <Link to="/team-performance">
              <Button variant="secondary" fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Team Performance
              </Button>
            </Link>
            
            {stats.unsyncedCount > 0 && (
              <Button 
                variant="warning" 
                fullWidth 
                onClick={handleSync} 
                disabled={syncStatus.loading || !networkStatus}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {syncStatus.loading ? 'Syncing...' : `Sync Data (${stats.unsyncedCount})`}
              </Button>
            )}
            
            {syncStatus.success && (
              <Alert type="success" message="Data synced successfully!" autoClose />
            )}
            
            {syncStatus.error && (
              <Alert 
                type="error" 
                message={syncStatus.error} 
                onClose={() => setSyncStatus(prev => ({ ...prev, error: null }))} 
              />
            )}
            
            {isAdmin() && (
              <Link to="/admin/config">
                <Button variant="outline" fullWidth>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Controls
                </Button>
              </Link>
            )}
          </div>
        </Card>
        
        <Card title="Recent Activity">
          {stats.recentEntries.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEntries.map((entry, index) => (
                <div key={entry.id || index} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <div>
                    <p className="font-medium text-white">Team {entry.teamNumber}</p>
                    <p className="text-sm text-gray-400">Match {entry.matchNumber} - {entry.synced ? 'Synced' : 'Not Synced'}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${entry.synced ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">No scouting entries yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Teams Section */}
      <Card title="Teams">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {teams.length > 0 ? (
            teams.map((team) => (
              <div key={team.number} className="bg-gray-700 rounded p-3 text-center">
                <p className="font-bold text-white">{team.number}</p>
                <p className="text-sm text-gray-300 truncate">{team.name}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center py-4 text-gray-400">No teams loaded</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;