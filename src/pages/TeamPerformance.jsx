import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import { ScoutingContext } from '../context/ScoutingContext';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TeamPerformance = () => {
  const { teams, scoutingData, scoutingConfig, loading } = useContext(ScoutingContext);
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [teamMetrics, setTeamMetrics] = useState(null);
  const [aggregatedStats, setAggregatedStats] = useState({});
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    if (selectedTeam && scoutingData.length > 0) {
      const teamData = scoutingData.filter(entry => entry.teamNumber === selectedTeam);
      setFilteredData(teamData);
      
      if (teamData.length > 0) {
        calculateMetrics(teamData);
      } else {
        setTeamMetrics(null);
        setAggregatedStats({});
        setMatchHistory([]);
      }
    } else {
      setFilteredData([]);
      setTeamMetrics(null);
      setAggregatedStats({});
      setMatchHistory([]);
    }
  }, [selectedTeam, scoutingData]);

  const calculateMetrics = (teamData) => {
    if (!scoutingConfig || !teamData || teamData.length === 0) return;

    const history = [];
    const metrics = {};
    const aggregated = {};
    
    // Group scouting categories for analysis
    const autoFields = [];
    const teleopFields = [];
    const endgameFields = [];
    
    // Map config fields to their respective periods
    if (scoutingConfig.categories) {
      scoutingConfig.categories.forEach((category, index) => {
        if (index === 0) return; // Skip match info
        
        const targetArray = 
          index === 1 ? autoFields :
          index === 2 ? teleopFields :
          index === 3 ? endgameFields : null;
        
        if (targetArray) {
          category.fields.forEach(field => {
            if (field.type === 'number') {
              targetArray.push(field.id);
            }
          });
        }
      });
    }
    
    // Calculate match history and metrics
    teamData.forEach(entry => {
      const matchData = {
        matchNumber: entry.matchNumber,
        alliance: entry.alliance,
        timestamp: entry.timestamp,
        autoScore: autoFields.reduce((sum, field) => sum + (parseInt(entry[field]) || 0), 0),
        teleopScore: teleopFields.reduce((sum, field) => sum + (parseInt(entry[field]) || 0), 0),
        endgameScore: endgameFields.reduce((sum, field) => sum + (parseInt(entry[field]) || 0), 0)
      };
      
      history.push(matchData);
      
      // Calculate aggregate stats for numeric fields
      if (scoutingConfig.categories) {
        scoutingConfig.categories.forEach(category => {
          category.fields.forEach(field => {
            if (field.type === 'number') {
              if (!aggregated[field.id]) {
                aggregated[field.id] = {
                  label: field.label,
                  values: [],
                  category: category.title
                };
              }
              aggregated[field.id].values.push(parseInt(entry[field.id]) || 0);
            }
          });
        });
      }
    });
    
    // Sort matches by number
    history.sort((a, b) => parseInt(a.matchNumber) - parseInt(b.matchNumber));
    
    // Calculate average, max, and consistency for each metric
    Object.keys(aggregated).forEach(key => {
      const values = aggregated[key].values;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const max = Math.max(...values);
      
      // Calculate consistency (standard deviation relative to mean)
      const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      const consistency = avg !== 0 ? (1 - (stdDev / (avg * 2))) * 100 : 100;
      
      metrics[key] = {
        label: aggregated[key].label,
        category: aggregated[key].category,
        average: avg,
        max: max,
        consistency: Math.max(0, Math.min(100, consistency))
      };
    });
    
    // Set state with calculated data
    setTeamMetrics(metrics);
    setAggregatedStats(aggregated);
    setMatchHistory(history);
  };

  const getChartOptions = (title) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        title: {
          display: true,
          text: title,
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 16 }
        },
        tooltip: {
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(100, 100, 100, 0.5)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(200, 200, 200, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        x: {
          grid: {
            color: 'rgba(200, 200, 200, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      }
    };
  };

  const renderTeamPerformanceCharts = () => {
    if (!teamMetrics || !matchHistory || matchHistory.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-400">No performance data available for this team</p>
        </div>
      );
    }

    const matchLabels = matchHistory.map(match => `Match ${match.matchNumber}`);
    
    // Match Performance Chart Data
    const matchPerformanceData = {
      labels: matchLabels,
      datasets: [
        {
          label: 'Auto',
          data: matchHistory.map(match => match.autoScore),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Teleop',
          data: matchHistory.map(match => match.teleopScore),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Endgame',
          data: matchHistory.map(match => match.endgameScore),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    };
    
    // Performance metrics for radar chart
    const performanceMetrics = {};
    Object.keys(teamMetrics).forEach(key => {
      const category = teamMetrics[key].category;
      if (!performanceMetrics[category]) {
        performanceMetrics[category] = {
          labels: [],
          values: []
        };
      }
      performanceMetrics[category].labels.push(teamMetrics[key].label);
      performanceMetrics[category].values.push(teamMetrics[key].average);
    });
    
    return (
      <div className="space-y-6">
        <Card title="Match Performance">
          <div className="h-80">
            <Bar 
              data={matchPerformanceData} 
              options={getChartOptions('Points Per Match')} 
            />
          </div>
        </Card>
        
        {Object.keys(performanceMetrics).map((category) => (
          <Card key={category} title={`${category} Performance`}>
            <div className="h-80">
              <Radar
                data={{
                  labels: performanceMetrics[category].labels,
                  datasets: [
                    {
                      label: `${category} Metrics`,
                      data: performanceMetrics[category].values,
                      backgroundColor: 'rgba(54, 162, 235, 0.3)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                      pointRadius: 4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                      },
                      pointLabels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: { size: 12 }
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        backdropColor: 'rgba(0, 0, 0, 0)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: 'rgba(255, 255, 255, 0.8)'
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        ))}
        
        <Card title="Performance Trend">
          <div className="h-80">
            <Line
              data={{
                labels: matchLabels,
                datasets: [
                  {
                    label: 'Total Score',
                    data: matchHistory.map(match => match.autoScore + match.teleopScore + match.endgameScore),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                    pointRadius: 4
                  }
                ]
              }}
              options={getChartOptions('Overall Performance Trend')}
            />
          </div>
        </Card>
      </div>
    );
  };

  const renderTeamStats = () => {
    if (!teamMetrics || Object.keys(teamMetrics).length === 0) return null;
    
    // Group metrics by category
    const metricsByCategory = {};
    Object.keys(teamMetrics).forEach(key => {
      const metric = teamMetrics[key];
      if (!metricsByCategory[metric.category]) {
        metricsByCategory[metric.category] = [];
      }
      metricsByCategory[metric.category].push({
        id: key,
        ...metric
      });
    });
    
    return (
      <Card title="Team Statistics">
        <div className="space-y-6">
          {Object.keys(metricsByCategory).map(category => (
            <div key={category} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-medium text-blue-400 mb-3">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metricsByCategory[category].map(metric => (
                  <div key={metric.id} className="bg-gray-700 rounded-md p-4">
                    <h4 className="text-sm text-gray-300 mb-1">{metric.label}</h4>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-bold text-white">
                        {metric.average.toFixed(1)}
                      </span>
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-gray-400">Max: {metric.max}</span>
                        <span className={`text-xs ${metric.consistency > 70 ? 'text-green-400' : metric.consistency > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {metric.consistency.toFixed(0)}% consistency
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Team Performance</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <div className="md:flex md:space-x-4">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <FormInput
              id="team-select"
              label="Select Team"
              type="select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              placeholder="Choose a team to view performance"
              options={teams.map(team => ({
                value: team.number,
                label: `${team.number} - ${team.name}`
              }))}
            />
          </div>
          
          <div className="md:w-1/2 flex items-end">
            <div className="w-full bg-gray-700 rounded-md p-3 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Matches Scouted</p>
                <p className="text-lg font-medium text-white">{filteredData.length}</p>
              </div>
              
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {selectedTeam ? (
        filteredData.length > 0 ? (
          <>
            {renderTeamStats()}
            {renderTeamPerformanceCharts()}
            
            <Card title="Match History">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Match
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Alliance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Auto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Teleop
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Endgame
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {matchHistory.map((match, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {match.matchNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span 
                            className={`px-2 py-1 rounded ${match.alliance === 'red' ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}
                          >
                            {match.alliance.charAt(0).toUpperCase() + match.alliance.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {match.autoScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {match.teleopScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {match.endgameScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {match.autoScore + match.teleopScore + match.endgameScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          <Alert type="info" message={`No scouting data available for Team ${selectedTeam}. Scout this team to see performance metrics.`} />
        )
      ) : (
        <div className="bg-gray-800 p-10 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-300">Select a team to view performance data</h3>
          <p className="mt-2 text-gray-400">
            Team performance metrics and match history will be displayed here
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamPerformance;