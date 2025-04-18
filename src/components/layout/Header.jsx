import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, X, ClipboardList, Award, Search, User, Settings } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <ClipboardList className="h-8 w-8" />
            <span className="text-xl font-bold">Saxon Scout</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
              <Search size={18} />
              <span>Search</span>
            </Link>
            <Link to="/events" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
              <Award size={18} />
              <span>Events</span>
            </Link>
            <Link to="/scouting" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
              <ClipboardList size={18} />
              <span>Scouting</span>
            </Link>
            <Link to="/profile" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
              <User size={18} />
              <span>Profile</span>
            </Link>
            <Link to="/settings" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3 pb-3">
              <Link 
                to="/" 
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Search size={18} />
                <span>Search</span>
              </Link>
              <Link 
                to="/events" 
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Award size={18} />
                <span>Events</span>
              </Link>
              <Link 
                to="/scouting" 
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <ClipboardList size={18} />
                <span>Scouting</span>
              </Link>
              <Link 
                to="/profile" 
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <Link 
                to="/settings" 
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 