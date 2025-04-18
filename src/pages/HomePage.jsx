import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, CalendarDays, TrendingUp } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchError, setSearchError] = useState(null);
  
  const handleSearch = (query) => {
    if (!query) {
      setSearchError('Please enter a team number or event name');
      return;
    }
    
    // If the query is a number, assume it's a team number
    if (/^\d+$/.test(query)) {
      navigate(`/team/${query}`);
    } else {
      // Otherwise, treat it as an event search query
      navigate(`/events?search=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Saxon Scout</h1>
          <p className="text-xl md:text-2xl mb-8">
            Your ultimate FIRST Robotics Competition scouting companion
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
            {searchError && (
              <p className="mt-2 text-yellow-200">{searchError}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Empowering FRC Teams with Data-Driven Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Search className="h-10 w-10" />}
            title="Team & Event Search"
            description="Quickly find information about any FRC team or event with our powerful search"
          />
          
          <FeatureCard 
            icon={<Award className="h-10 w-10" />}
            title="Match Data"
            description="Access match results, team rankings, and detailed performance statistics"
          />
          
          <FeatureCard 
            icon={<CalendarDays className="h-10 w-10" />}
            title="Scouting System"
            description="Collect and organize scouting data with our customizable forms and reports"
          />
          
          <FeatureCard 
            icon={<TrendingUp className="h-10 w-10" />}
            title="Team Analysis"
            description="Analyze team performance across multiple matches and events with visual charts"
          />
        </div>
      </div>
      
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Get Started
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StartCard 
              number="1"
              title="Search for a Team"
              description="Enter a team number to view their profile, performance stats, and match history"
              onClick={() => navigate('/teams')}
            />
            
            <StartCard 
              number="2"
              title="Browse Events"
              description="Find events by year, region, or search by name to see participating teams and matches"
              onClick={() => navigate('/events')}
            />
            
            <StartCard 
              number="3"
              title="Scout a Match"
              description="Use our scouting form to collect data during matches and save it for analysis"
              onClick={() => navigate('/scouting')}
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Powered by The Blue Alliance and FIRST APIs</h2>
        <p className="text-gray-600 mb-8">
          Saxon Scout integrates with The Blue Alliance and FIRST API services to provide 
          up-to-date information about teams, events, and matches.
        </p>
        
        <button 
          onClick={() => navigate('/about')}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
    <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StartCard = ({ number, title, description, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center mb-4">
      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
        {number}
      </div>
      <h3 className="text-lg font-semibold ml-3">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage; 