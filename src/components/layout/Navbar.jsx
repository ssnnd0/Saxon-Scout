import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme, setTheme, THEMES } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const teamNumber = import.meta.env.VITE_TEAM_NUMBER || '611'; // Default to 611 if env var not set

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Don't hide navbar on login page for this demo
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="bg-surface border-r border-border py-4 px-6 hidden md:block w-64 h-screen overflow-auto">
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-xl font-bold text-text-primary">
            Saxon Scout
          </Link>
        </div>
        
        <div className="mb-6">
          <select 
            className="input w-full"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value={THEMES.GREY}>Grey Theme</option>
            <option value={THEMES.LIGHT}>Light Theme</option>
            <option value={THEMES.DARK}>Dark Theme</option>
            <option value={THEMES.BLUE}>Blue Theme</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1 mb-6">
          <h3 className="text-text-secondary text-xs uppercase font-semibold mb-2 px-3">Main</h3>
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </div>
          </Link>
          <Link 
            to="/dashboard" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </div>
          </Link>
        </div>

        <div className="flex flex-col space-y-1 mb-6">
          <h3 className="text-text-secondary text-xs uppercase font-semibold mb-2 px-3">Scouting</h3>
          <Link 
            to="/scouting-form" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/scouting-form' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Scout Match
            </div>
          </Link>
          <Link 
            to="/team-performance" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/team-performance' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Team Performance
            </div>
          </Link>
          <Link 
            to="/analytics" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/analytics' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Analytics
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col space-y-1 mb-6">
          <h3 className="text-text-secondary text-xs uppercase font-semibold mb-2 px-3">Navigation</h3>
          <Link 
            to="/teams" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/teams' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Teams
            </div>
          </Link>
          <Link 
            to="/events" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/events' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events
            </div>
          </Link>
          <Link 
            to="/matches" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/matches' ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Matches
            </div>
          </Link>
          <Link 
            to={`/team-${teamNumber}`} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === `/team-${teamNumber}` ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-primary-50 hover:text-text-primary'}`}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Team {teamNumber}
            </div>
          </Link>
        </div>

        <div className="mt-auto">
          <Link 
            to="/login" 
            className="bg-primary-100 hover:bg-primary-200 text-primary-700 py-2 px-3 rounded text-sm w-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {isLoginPage ? "Back to Home" : "Login"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;