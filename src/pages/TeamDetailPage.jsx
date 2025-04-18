import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Award, 
  Users, 
  Calendar, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Link as LinkIcon,
  ArrowLeft,
  Trophy,
  BarChart2,
  Globe,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

const TeamDetailPage = () => {
  const { teamNumber } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const teamData = await apiService.getTeamData(teamNumber);
        setTeam(teamData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message || "Failed to load team data");
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Team</h2>
        <p className="mb-4">{error}</p>
        <Link to="/teams" className="text-blue-500 hover:underline flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teams
        </Link>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Team Not Found</h2>
        <p className="mb-4">We couldn't find team #{teamNumber}.</p>
        <Link to="/teams" className="text-blue-500 hover:underline flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teams
        </Link>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" /> Team Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Number:</span>
                  <span className="font-medium">{team.team_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Name:</span>
                  <span className="font-medium">{team.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{team.city}, {team.state_prov}, {team.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rookie Year:</span>
                  <span className="font-medium">{team.rookie_year}</span>
                </div>
                {team.website && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Website:</span>
                    <a href={team.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {team.website}
                    </a>
                  </div>
                )}
                {team.motto && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Motto:</span>
                    <span className="font-medium">"{team.motto}"</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-blue-500" /> Team Achievements
              </h3>
              <div className="space-y-2">
                {team.achievements && team.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{achievement}</span>
                  </div>
                ))}
                {(!team.achievements || team.achievements.length === 0) && (
                  <p className="text-gray-500">No achievements data available</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'matches':
        return (
          <div className="bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium p-4 border-b">Recent Matches</h3>
            {team.matches && team.matches.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alliance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.matches.map((match, index) => (
                      <tr key={match.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap">{match.event}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{match.match}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${match.alliance === 'Red' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            {match.alliance}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{match.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${match.result === 'Win' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {match.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No match data available</p>
              </div>
            )}
          </div>
        );
      case 'awards':
        return (
          <div className="bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium p-4 border-b">Team Awards</h3>
            {team.awards && team.awards.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {team.awards.map((award, index) => (
                  <div key={award.id || index} className="p-4 flex items-start">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">{award.name}</h4>
                      <p className="text-sm text-gray-500">{award.year} - {award.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No awards data available</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/teams" className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Team {team.team_number}: {team.nickname || team.name}
            </h1>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Globe className="w-4 h-4 mr-1" />
              <span>{team.city}, {team.state_prov}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4 mr-1" />
              <span>Since {team.rookie_year}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'matches' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'awards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Awards
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default TeamDetailPage; 