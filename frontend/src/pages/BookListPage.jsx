import React, { useState, useEffect } from 'react';
import { Book, Search, Filter, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import FilterOptions from '../components/FilterOptions';
import { fetchAllBooks, fetchGenres } from '../services/api';

function BookListPage() {
  const [allBooks, setAllBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const limit = 8; // Number of books per page

  // Effect to fetch genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      setIsLoadingGenres(true);
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(Array.isArray(fetchedGenres) ? fetchedGenres : []);
      } catch (err) {
        console.error("API Error (Genres):", err);
        setError(err.message || 'Failed to load genres.');
      } finally {
        setIsLoadingGenres(false);
      }
    };
    loadGenres();
  }, []);

  // Effect to fetch books based on current page, search term, and genre
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoadingBooks(true);
      setError(null);
      try {
        const data = await fetchAllBooks({
          page: currentPage,
          limit: limit,
          search: searchTerm,
          genre: selectedGenre
        });
        setAllBooks(data.books || []);
        setTotalPages(data.pages || 1);
        setCurrentPage(data.page || 1);
        setTotalBooks(data.totalBooks || 0);
      } catch (err) {
        setError(err.message || 'Failed to load books.');
        console.error("API Error (Books):", err);
        setAllBooks([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalBooks(0);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    loadBooks();
  }, [currentPage, searchTerm, selectedGenre]);

  // Handler for search input
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handler for genre dropdown change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  // Handler for pagination button clicks
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section with Title and Description */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 shadow-lg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 pattern-dots pattern-size-2 pattern-opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white bg-opacity-20 rounded-full mb-4">
            <Book className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
            Explore Our <span className="text-yellow-300">Book Collection</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            Discover new authors and titles from our curated collection. Use the filters below to find your next read.
          </p>
        </div>
      </section>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-2/3">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="w-full md:w-1/3">
            {isLoadingGenres ? (
              <div className="h-10 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Loading genres...</p>
              </div>
            ) : (
              <FilterOptions
                genres={genres}
                currentGenre={selectedGenre}
                onGenreChange={handleGenreChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {error && <ErrorMessage message={error} />}

      {/* Loading Spinner */}
      {isLoadingBooks && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Books Display */}
      {!isLoadingBooks && !error && (
        <div className="space-y-8">
          {/* Results Summary */}
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-medium text-gray-700 flex items-center">
              <span className="mr-2">
                {searchTerm || selectedGenre ? 'Filtered Results' : 'All Books'}
              </span>
              {searchTerm && <span className="text-sm text-gray-500">"{searchTerm}"</span>}
              {selectedGenre && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{selectedGenre}</span>}
            </h2>
            <p className="text-sm text-gray-500">
              Showing {allBooks.length} of {totalBooks} books
            </p>
          </div>

          {/* Book Grid */}
          {Array.isArray(allBooks) && allBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-10 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-lg text-gray-700 font-medium">No books found matching your criteria.</p>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 pb-2 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <div className="hidden sm:flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show page numbers around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`inline-flex items-center justify-center w-8 h-8 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        } border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookListPage;
