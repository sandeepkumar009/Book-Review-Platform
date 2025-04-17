import React from 'react';
import { Link } from 'react-router-dom';
import { Star, User, Calendar, Tag } from 'lucide-react';

function BookCard({ book }) {
  const bookId = book._id;
  const placeholderImageUrl = `https://placehold.co/300x450/e2e8f0/cbd5e0?text=${encodeURIComponent(book.title)}`;

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
      <Link to={`/books/${bookId}`} className="block overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <span className="text-white font-medium pb-4 text-sm">View Details</span>
        </div>
        <img
          src={book.coverImageUrl || placeholderImageUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
        />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
            <Link to={`/books/${bookId}`}>{truncateText(book.title, 50)}</Link>
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <User className="w-4 h-4 mr-1 text-gray-400" />
            <span>{book.author}</span>
          </div>
          
          {book.publishedYear && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
              <span>{book.publishedYear}</span>
              
              {book.genre && (
                <>
                  <span className="mx-2">•</span>
                  <Tag className="w-3 h-3 mr-1 text-gray-400" />
                  <span>{book.genre}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Rating Component with Enhanced Design */}
        <div className="flex items-center mb-3">
          {typeof book.averageRating === 'number' ? (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">{book.averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-1">/ 5</span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 italic bg-gray-50 px-2 py-1 rounded-full">No ratings yet</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-3 flex-grow mb-4">
          {book.description || 'No description available.'}
        </p>
        
        {/* Button */}
        <Link
          to={`/books/${bookId}`}
          className="mt-auto inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center text-sm font-medium py-2 px-4 rounded-lg transition duration-300 shadow-sm hover:shadow"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default BookCard;
