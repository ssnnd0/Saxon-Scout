import React, { useState } from 'react';
import { Clock, Award } from 'lucide-react';

function MatchesPage() {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  
  const upcomingMatches = [
    { 
      id: 'm1', 
      matchNumber: 32, 
      time: '10:45 AM', 
      red: ['254', '1678', '118'], 
      blue: ['2337', '987', '611'],
      played: false 
    },
    { 
      id: 'm2', 
      matchNumber: 33, 
      time: '10:52 AM', 
      red: ['1114', '2056', '5406'], 
      blue: ['3538', '2767', '1923'],
      played: false 
    },
    { 
      id: 'm3', 
      matchNumber: 34, 
      time: '11:00 AM', 
      red: ['2910', '4613', '971'], 
      blue: ['33', '1741', '842'], 
      played: false 
    }
  ];
  
  const playedMatches = [
    { 
      id: 'm4', 
      matchNumber: 29, 
      time: '10:22 AM', 
      red: ['4414', '3707', '3357'], 
      blue: ['2928', '2481', '1410'], 
      redScore: 75, 
      blueScore: 62,
      played: true 
    },
    { 
      id: 'm5', 
      matchNumber: 30, 
      time: '10:30 AM', 
      red: ['4829', '1622', '3128'], 
      blue: ['4201', '7289', '2791'], 
      redScore: 42, 
      blueScore: 89,
      played: true 
    },
    { 
      id: 'm6', 
      matchNumber: 31, 
      time: '10:37 AM', 
      red: ['2791', '5199', '3647'], 
      blue: ['2046', '1690', '1868'], 
      redScore: 56, 
      blueScore: 51,
      played: true 
    }
  ];
  
  const matches = selectedTab === 'upcoming' ? upcomingMatches : playedMatches;
  
  const renderTeams = (teams, alliance) => {
    return (
      <div className="flex flex-col">
        {teams.map((team, index) => (
          <div 
            key={`${alliance}-${team}`} 
            className={`text-sm font-medium ${alliance === 'red' ? 'text-red-600' : 'text-blue-600'}`}
          >
            {team}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Match Schedule</h1>
      
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
        >
          <option value="upcoming">Upcoming Matches</option>
          <option value="played">Played Matches</option>
        </select>
      </div>
      
      <div className="hidden sm:block mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8" aria-label="Tabs">
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`${
                selectedTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming Matches
            </button>
            <button
              onClick={() => setSelectedTab('played')}
              className={`${
                selectedTab === 'played'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Played Matches
            </button>
          </nav>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {matches.map((match) => (
            <li key={match.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 space-x-6">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">{match.matchNumber}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        {match.played ? (
                          <Award className="h-5 w-5 text-yellow-500 mr-1.5" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400 mr-1.5" />
                        )}
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {match.played ? 'Final' : match.time}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="flex items-center space-x-8">
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-1">RED ALLIANCE</p>
                            {renderTeams(match.red, 'red')}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-600 mb-1">BLUE ALLIANCE</p>
                            {renderTeams(match.blue, 'blue')}
                          </div>
                        </div>
                        
                        {match.played && (
                          <div className="flex items-center">
                            <div className={`text-lg font-bold ${match.redScore > match.blueScore ? 'text-red-600' : 'text-gray-500'}`}>
                              {match.redScore}
                            </div>
                            <span className="mx-2 text-gray-400">-</span>
                            <div className={`text-lg font-bold ${match.blueScore > match.redScore ? 'text-blue-600' : 'text-gray-500'}`}>
                              {match.blueScore}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {!match.played && (
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Scout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MatchesPage; 