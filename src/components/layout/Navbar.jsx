import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar on login page
  }

  return (
    <nav className="bg-gray-800 py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            Team 611 Scouting
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link 
            to="/scouting" 
            className={`text-sm font-medium ${location.pathname === '/scouting' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            onClick={closeMenu}
          >
            Scout Match
          </Link>
          <Link 
            to="/team-performance" 
            className={`text-sm font-medium ${location.pathname === '/team-performance' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            onClick={closeMenu}
          >
            Team Performance
          </Link>
          
          {/* Admin Links */}
          {user && user.role === 'admin' && (
            <>
              <div className="border-l border-gray-600 h-6"></div>
              <Link 
                to="/admin/config" 
                className={`text-sm font-medium ${location.pathname === '/admin/config' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={closeMenu}
              >
                Form Config
              </Link>
              <Link 
                to="/admin/users" 
                className={`text-sm font-medium ${location.pathname === '/admin/users' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={closeMenu}
              >
                Users
              </Link>
              <Link 
                to="/admin/data" 
                className={`text-sm font-medium ${location.pathname === '/admin/data' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={closeMenu}
              >
                Data Management
              </Link>
            </>
          )}
          
          <div className="border-l border-gray-600 h-6"></div>
          <div className="flex items-center">
            <span className="text-gray-400 text-sm mr-4">{user?.name || ''}</span>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 bg-gray-700 rounded-lg px-2 py-3 shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/scouting" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/scouting' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={closeMenu}
            >
              Scout Match
            </Link>
            <Link 
              to="/team-performance" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/team-performance' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={closeMenu}
            >
              Team Performance
            </Link>
            
            {/* Admin Links */}
            {user && user.role === 'admin' && (
              <>
                <div className="border-t border-gray-600 my-1"></div>
                <Link 
                  to="/admin/config" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/config' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  onClick={closeMenu}
                >
                  Form Config
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/users' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  onClick={closeMenu}
                >
                  Users
                </Link>
                <Link 
                  to="/admin/data" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/data' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  onClick={closeMenu}
                >
                  Data Management
                </Link>
              </>
            )}
            
            <div className="border-t border-gray-600 my-1"></div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-400 text-sm">{user?.name || ''}</span>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;