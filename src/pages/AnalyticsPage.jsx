import React, { useState } from 'react';
import { BarChart, PieChart, LineChart, Activity, Filter } from 'lucide-react';

function AnalyticsPage() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('scoring');
  
  const teams = [
    { number: '611', name: 'Saxons' },
    { number: '254', name: 'The Cheesy Poofs' },
    { number: '118', name: 'Robonauts' },
    { number: '1678', name: 'Citrus Circuits' },
    { number: '2337', name: 'EngiNERDs' }
  ];
  
  const metrics = [
    { id: 'scoring', name: 'Scoring Performance', icon: <BarChart className="h-5 w-5" /> },
    { id: 'climbing', name: 'Climbing Success Rate', icon: <PieChart className="h-5 w-5" /> },
    { id: 'teleop', name: 'Teleop Trends', icon: <LineChart className="h-5 w-5" /> },
    { id: 'overall', name: 'Overall Performance', icon: <Activity className="h-5 w-5" /> }
  ];

  // Sample data - in a real app, this would come from your backend
  const teamStats = {
    '611': {
      scoring: {
        autoAvg: 8.2,
        teleopAvg: 15.7,
        totalAvg: 23.9,
        matchData: [22, 18, 30, 24, 25]
      },
      climbing: {
        success: 80,
        fail: 20,
        avgTime: 12.4
      },
      teleop: {
        upperHub: [5, 8, 7, 9, 6],
        lowerHub: [4, 3, 5, 4, 6]
      },
      overall: {
        rank: 12,
        opr: 45.2,
        dpr: 20.1,
        ccwm: 25.1
      }
    },
    '254': {
      scoring: {
        autoAvg: 12.5,
        teleopAvg: 22.3,
        totalAvg: 34.8,
        matchData: [30, 35, 38, 32, 39]
      },
      climbing: {
        success: 100,
        fail: 0,
        avgTime: 8.2
      },
      teleop: {
        upperHub: [12, 14, 10, 12, 15],
        lowerHub: [5, 4, 8, 6, 7]
      },
      overall: {
        rank: 1,
        opr: 75.3,
        dpr: 15.2,
        ccwm: 60.1
      }
    }
  };

  const renderContent = () => {
    if (!selectedTeam) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Select a team to view analytics</p>
        </div>
      );
    }

    if (!teamStats[selectedTeam]) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for this team</p>
        </div>
      );
    }

    const data = teamStats[selectedTeam];

    switch (selectedMetric) {
      case 'scoring':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scoring Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-700">Auto Avg</p>
                <p className="text-2xl font-bold">{data.scoring.autoAvg}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-700">Teleop Avg</p>
                <p className="text-2xl font-bold">{data.scoring.teleopAvg}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-700">Total Avg</p>
                <p className="text-2xl font-bold">{data.scoring.totalAvg}</p>
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-700 mb-3">Match History</h4>
            <div className="h-64 bg-white p-4 rounded-lg border border-gray-200 flex items-end space-x-4">
              {data.scoring.matchData.map((score, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-blue-500 w-full rounded-t-md" 
                    style={{ height: `${score * 2}px` }}
                  ></div>
                  <p className="text-xs mt-2">Match {index + 1}</p>
                  <p className="text-sm font-semibold">{score}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'climbing':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Climbing Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="text-center text-gray-700 mb-4">Success Rate</h4>
                <div className="relative h-48">
                  <div className="flex h-full">
                    <div 
                      className="bg-green-500 rounded-l-full" 
                      style={{ width: `${data.climbing.success}%` }}
                    ></div>
                    <div 
                      className="bg-red-500 rounded-r-full" 
                      style={{ width: `${data.climbing.fail}%` }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{data.climbing.success}%</p>
                      <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="text-center text-gray-700 mb-4">Average Climb Time</h4>
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-blue-600">{data.climbing.avgTime}s</p>
                    <p className="text-sm text-gray-500 mt-2">Average Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'teleop':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Teleop Performance</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-md font-medium text-gray-700 mb-3">Scoring by Match</h4>
              <div className="h-64 flex flex-col justify-end">
                <div className="flex items-end space-x-2">
                  {[0, 1, 2, 3, 4].map((matchIndex) => (
                    <div key={matchIndex} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center">
                        <div 
                          className="bg-blue-700 w-3/4 rounded-t-sm mb-1" 
                          style={{ height: `${data.teleop.upperHub[matchIndex] * 6}px` }}
                        ></div>
                        <div 
                          className="bg-blue-400 w-3/4 rounded-t-sm" 
                          style={{ height: `${data.teleop.lowerHub[matchIndex] * 6}px` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-2">Match {matchIndex + 1}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-700 mr-1"></div>
                    <span className="text-xs">Upper Hub</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 mr-1"></div>
                    <span className="text-xs">Lower Hub</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'overall':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Rank</p>
                <p className="text-3xl font-bold">#{data.overall.rank}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">OPR</p>
                <p className="text-3xl font-bold">{data.overall.opr}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">DPR</p>
                <p className="text-3xl font-bold">{data.overall.dpr}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">CCWM</p>
                <p className="text-3xl font-bold">{data.overall.ccwm}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-md font-medium text-gray-700 mb-4">Performance Breakdown</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/4 text-sm text-gray-500">Offensive Power</div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(data.overall.opr / 80) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 text-sm text-gray-500">Defensive Power</div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full" 
                      style={{ width: `${(data.overall.dpr / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 text-sm text-gray-500">Overall Rating</div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full" 
                      style={{ width: `${(data.overall.ccwm / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Team Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-6">
                <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Team
                </label>
                <select
                  id="team-select"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.number} value={team.number}>
                      {team.number} - {team.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Metrics</h4>
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                        selectedMetric === metric.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{metric.icon}</span>
                      <span>{metric.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage; 