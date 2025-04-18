import React from 'react';
import { Link } from 'react-router-dom';
import TeamSearch from '../components/TeamSearch';
import { useTheme } from '../context/ThemeContext';

function HomePage() {
  const { theme, setTheme, THEMES } = useTheme();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
          Saxon Scout
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-text-secondary">
          A modern scouting application for FIRST Robotics Competition teams
        </p>
        
        <div className="mt-6 inline-flex items-center justify-center">
          <span className="mr-3 text-sm text-text-secondary">Theme:</span>
          <select 
            className="input max-w-xs"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value={THEMES.GREY}>Grey</option>
            <option value={THEMES.LIGHT}>Light</option>
            <option value={THEMES.DARK}>Dark</option>
            <option value={THEMES.BLUE}>Blue</option>
          </select>
        </div>
      </div>
      
      <div className="mb-10">
        <TeamSearch />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Link
          to="/teams"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
        >
          <div className="bg-primary-100 text-primary-600 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Teams</h2>
          <p className="mt-2 text-text-secondary">Browse and search FRC teams</p>
        </Link>
        
        <Link
          to="/events"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
        >
          <div className="bg-primary-100 text-primary-600 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Events</h2>
          <p className="mt-2 text-text-secondary">View upcoming and past events</p>
        </Link>
        
        <Link
          to="/matches"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
        >
          <div className="bg-primary-100 text-primary-600 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Matches</h2>
          <p className="mt-2 text-text-secondary">Track match schedules and results</p>
        </Link>
        
        <Link
          to="/scouting"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
        >
          <div className="bg-primary-100 text-primary-600 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Scouting</h2>
          <p className="mt-2 text-text-secondary">Collect match data</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/analytics"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex items-center"
        >
          <div className="bg-primary-100 text-primary-600 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Team Analytics</h2>
            <p className="text-text-secondary">Analyze team performance data</p>
          </div>
        </Link>
        
        <Link
          to="/dashboard"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex items-center"
        >
          <div className="bg-primary-100 text-primary-600 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-text-secondary">View your scouting dashboard</p>
          </div>
        </Link>
        
        <Link
          to="/team-611"
          className="card p-6 hover:shadow-lg transition-shadow duration-300 flex items-center"
        >
          <div className="bg-primary-100 text-primary-600 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Team 611</h2>
            <p className="text-text-secondary">Learn about Team 611</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HomePage; 