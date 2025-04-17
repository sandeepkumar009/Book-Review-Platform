import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

function FilterOptions({ genres, currentGenre, onGenreChange }) {
  return (
    <div className="w-full">
      <label htmlFor="genre-filter" className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Filter className="w-4 h-4 mr-2 text-blue-600" />
        Filter by Genre
      </label>
      <div className="relative">
        <select
          id="genre-filter"
          name="genre"
          value={currentGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm appearance-none bg-white transition-all duration-200 hover:border-blue-300"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Optional: Genre Pills/Tags could go here for multi-select in the future */}
      {currentGenre && (
        <div className="mt-2 text-xs text-blue-600">
          Selected: <span className="font-medium">{currentGenre}</span>
          <button 
            onClick={() => onGenreChange('')}
            className="ml-2 text-gray-500 hover:text-red-500 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterOptions;
