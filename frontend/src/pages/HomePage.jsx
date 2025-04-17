import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, TrendingUp, ChevronRight, Filter, Star, Clock, BookOpen, Library } from 'lucide-react';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchFeaturedBooks } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        const data = await fetchFeaturedBooks();
        setFeaturedBooks(data.books || []);
      } catch (err) {
        setError(err.message || 'Failed to load featured books.');
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section - Dynamic based on authentication */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-12 shadow-lg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 pattern-dots pattern-size-2 pattern-opacity-10"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {isAuthenticated ? (
            // Logged-in user experience
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Welcome back, <span className="text-yellow-300">{user?.name || 'Reader'}</span>!
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Continue your reading journey with personalized recommendations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/books" className="bg-white text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-full font-medium shadow-md transition duration-300 flex items-center">
                  <Library className="mr-2 h-5 w-5" />
                  My Bookshelf
                </Link>
                <Link to="/books" className="bg-blue-800 text-white hover:bg-blue-900 py-3 px-6 rounded-full font-medium shadow-md transition duration-300 flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Continue Reading
                </Link>
              </div>
            </>
          ) : (
            // Guest experience
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Discover Your Next <span className="text-yellow-300">Reading Adventure</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Join our community of book lovers to find, review, and share your favorite reads.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/books" className="bg-white text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-full font-medium shadow-md transition duration-300 flex items-center">
                  <Book className="mr-2 h-5 w-5" />
                  Browse Catalog
                </Link>
                <Link to="/register" className="bg-blue-800 text-white hover:bg-blue-900 py-3 px-6 rounded-full font-medium shadow-md transition duration-300 flex items-center">
                  Join Now
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="text-blue-600 h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Featured Books</h2>
          </div>
          <Link to="/books" className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm">
            View all books <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Loading and Error States */}
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {/* Book Grid */}
        {!isLoading && !error && (
          featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-10 text-center">
              <p className="text-lg text-gray-600">No featured books available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for our curated selection.</p>
            </div>
          )
        )}
      </section>

      {/* Additional Sections - Different based on auth status */}
      {isAuthenticated ? (
        // Personalized sections for logged-in users
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Recent Activity */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Your Recent Activity
            </h3>
            <div className="space-y-3">
              {/* These would be populated dynamically in a real app */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-start">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">You rated "The Great Gatsby"</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-start">
                <div className="bg-green-100 p-2 rounded-md mr-3">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Started reading "To Kill a Mockingbird"</p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
              </div>
              <Link to={`/profile/${user._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2">
                View all activity <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Reading Recommendations */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Book className="h-5 w-5 mr-2 text-blue-600" />
              Reading Recommendations
            </h3>
            <p className="text-gray-600 mb-4">Based on your reading history and preferences:</p>
            <div className="space-y-2">
              <Link to="/books" className="bg-white flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="mr-3 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  📚
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">Mystery & Thriller</p>
                  <p className="text-xs text-gray-500">Explore page-turning suspense</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link to="/books" className="bg-white flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="mr-3 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  📖
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">Contemporary Fiction</p>
                  <p className="text-xs text-gray-500">Stories that reflect modern life</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Sections for guests
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Reading Categories */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Biography', 'Self-Help'].map((category) => (
                <Link
                  key={category}
                  to={`/books?category=${category.toLowerCase()}`}
                  className="bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-gray-700 text-sm font-medium flex justify-between items-center"
                >
                  {category}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Join Community */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Join Our Community</h3>
              <p className="text-gray-600 mb-4">Connect with fellow readers, participate in discussions, and share your thoughts on your favorite books.</p>
            </div>
            <div className="flex space-x-3">
              <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-medium shadow-sm transition duration-300 text-sm">
                Sign Up
              </Link>
              <Link to="/login" className="bg-white text-blue-600 border border-blue-200 hover:border-blue-400 py-2 px-4 rounded-lg font-medium shadow-sm transition duration-300 text-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;