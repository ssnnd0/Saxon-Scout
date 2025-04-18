import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchBar from './common/SearchBar';
import Card from './common/Card';

const TeamsSearch = ({ teams, title = "Teams Search" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeams, setFilteredTeams] = useState([]);

  // Process teams based on search
  useEffect(() => {
    let result = [...teams];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        team => 
          team.number.toString().includes(query) || 
          team.name.toLowerCase().includes(query) ||
          (team.location && team.location.toLowerCase().includes(query))
      );
    }
    
    setFilteredTeams(result);
  }, [teams, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Card title={title}>
      <div className="flex items-center justify-between mb-4">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search by team number, name or location..." 
          className="flex-1"
        />
      </div>
      
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredTeams.map((team) => (
            <Link 
              key={team.number} 
              to={`/teams/${team.number}`}
              className="bg-surface hover:bg-gray-50 border border-border rounded p-3 text-center transition-colors"
            >
              <p className="font-bold text-text-primary">{team.number}</p>
              <p className="text-sm text-text-secondary truncate">{team.name}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-2">
            <Search className="h-10 w-10 mx-auto text-text-disabled" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">No teams found</h3>
          <p className="text-text-secondary">
            {searchQuery ? 
              'Try adjusting your search terms' : 
              'No teams available'}
          </p>
        </div>
      )}
      
      {filteredTeams.length > 0 && filteredTeams.length < teams.length && (
        <div className="text-center text-sm text-text-secondary mt-4">
          Showing {filteredTeams.length} of {teams.length} teams
        </div>
      )}
    </Card>
  );
};

export default TeamsSearch; 