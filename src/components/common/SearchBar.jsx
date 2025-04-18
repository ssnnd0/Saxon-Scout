import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search for teams or events...', 
  initialValue = '',
  onClear = null,
  showSearchButton = true,
  className = '' 
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onClear) {
      onClear();
    } else {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-secondary" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="input pl-10 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-text-secondary hover:text-text-primary" />
          </button>
        )}
        
        {showSearchButton && (
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 transition-colors">
              Search
            </span>
          </button>
        )}
      </div>
      
      {isFocused && (
        <div className="text-xs text-text-secondary mt-1 px-3">
          Press Enter to search
        </div>
      )}
    </form>
  );
};

export default SearchBar; 