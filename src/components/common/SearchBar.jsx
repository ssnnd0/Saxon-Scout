import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search for teams or events...' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            Search
          </span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 