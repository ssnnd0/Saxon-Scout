import { format } from 'date-fns';
import { MapPin, Calendar } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  // Format dates
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const dateString = startDate.getMonth() === endDate.getMonth() 
    ? `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`
    : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;

  // Determine event type name
  const getEventTypeName = (eventType) => {
    switch (eventType) {
      case 0: return 'Regional';
      case 1: return 'District';
      case 2: return 'District Championship';
      case 3: return 'Championship Division';
      case 4: return 'Championship Finals';
      case 5: return 'District Championship Division';
      case 6: return 'Festival of Champions';
      case 7: return 'Off-Season';
      case 8: return 'Pre-Season';
      case 9: return 'Remote';
      case 10: return 'Replay';
      case 99: return 'Unlabeled';
      default: return 'Unknown';
    }
  };

  const eventTypeName = getEventTypeName(event.event_type);
  const eventTitle = event.short_name || event.name;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold truncate">{eventTitle}</span>
        <span className="bg-blue-900 text-white text-xs px-2 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
          {eventTypeName}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-2">
          <Calendar className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
          <span className="text-gray-700">{dateString}</span>
        </div>
        
        {(event.city || event.state_prov) && (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
            <span className="text-gray-700">
              {[event.city, event.state_prov, event.country !== 'USA' ? event.country : null]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}
        
        {event.website && (
          <a 
            href={event.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            Event Website
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard; 