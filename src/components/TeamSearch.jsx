import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TBAService from '../services/TBAService';

const TeamSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await TBAService.searchTeams(query);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError('No teams found matching your search criteria.');
      }
    } catch (err) {
      console.error('Error searching teams:', err);
      setError('Failed to search teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = (teamNumber) => {
    navigate(`/teams/${teamNumber}`);
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4">Team Search</h2>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <input
            type="text"
            className="input flex-grow"
            placeholder="Enter team number or name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-primary ml-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </span>
            ) : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Search Results</h3>
          <div className="overflow-auto max-h-64">
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface">
                  <th className="py-2 px-4 text-left">Team #</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Location</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((team) => (
                  <tr 
                    key={team.key} 
                    className="border-t border-border hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTeamSelect(team.team_number)}
                  >
                    <td className="py-2 px-4">{team.team_number}</td>
                    <td className="py-2 px-4">{team.nickname}</td>
                    <td className="py-2 px-4">{team.city}, {team.state_prov}</td>
                    <td className="py-2 px-4 text-right">
                      <button 
                        className="text-primary-600 hover:text-primary-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeamSelect(team.team_number);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {!loading && !error && results.length === 0 && query && (
        <div className="text-center text-text-secondary py-4">
          Type a team number or name and click Search
        </div>
      )}
    </div>
  );
};

export default TeamSearch; 