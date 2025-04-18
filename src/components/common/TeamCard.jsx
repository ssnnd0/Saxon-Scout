const TeamCard = ({ team, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-xl">Team {team.team_number}</span>
        {team.rookie_year && (
          <span className="bg-yellow-500 text-gray-900 text-xs px-2 py-1 rounded-full font-semibold">
            {team.rookie_year === new Date().getFullYear() ? 'Rookie' : `Since ${team.rookie_year}`}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{team.nickname || team.name}</h3>
        
        <div className="text-gray-600 mb-3">
          {team.city && team.state_prov && (
            <p>{team.city}, {team.state_prov}</p>
          )}
          {team.country && team.country !== 'USA' && <p>{team.country}</p>}
        </div>
        
        {team.website && (
          <a 
            href={team.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            Team Website
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard; 