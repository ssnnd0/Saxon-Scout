import React, { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

function EventsPage() {
  const [events] = useState([
    {
      id: '2023vahay',
      name: 'Haymarket District Event',
      location: 'Haymarket, VA',
      date: 'Mar 3-5, 2023',
      teams: 36,
      type: 'District'
    },
    {
      id: '2023vagle',
      name: 'Glen Allen District Event',
      location: 'Glen Allen, VA',
      date: 'Mar 17-19, 2023',
      teams: 42,
      type: 'District'
    },
    {
      id: '2023chcmp',
      name: 'FIRST Chesapeake District Championship',
      location: 'Hampton, VA',
      date: 'Apr 6-8, 2023',
      teams: 60,
      type: 'Championship'
    },
    {
      id: '2024vafal',
      name: 'Falls Church District Event',
      location: 'Falls Church, VA',
      date: 'Mar 1-3, 2024',
      teams: 38,
      type: 'District'
    },
    {
      id: '2024vapor',
      name: 'Portsmouth District Event',
      location: 'Portsmouth, VA',
      date: 'Mar 15-17, 2024',
      teams: 40,
      type: 'District'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">FRC Events</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{event.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{event.id.toUpperCase()}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.date}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.location}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1" /> Teams
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.teams}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.type === 'Championship' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.type}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Matches
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage; 