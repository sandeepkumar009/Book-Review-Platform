import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative group">
        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 ${isFocused ? 'text-blue-600' : ''}`}>
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          placeholder="Search for books by title, author, or genre..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 pl-10 pr-10 border ${
            isFocused ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-300'
          } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-200 transition-all duration-200`}
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-500 hover:text-red-500"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3 mr-1 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors duration-200"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      
      {/* Optional: Search suggestions/history could go here */}
    </form>
  );
}

export default SearchBar;