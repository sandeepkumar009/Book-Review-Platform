import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { fetchBookById, fetchReviewsByBookId, submitNewReview } from '../services/api';
import { Star, ArrowLeft, BookOpen, Calendar, Hash, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [errorBook, setErrorBook] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const [submitReviewError, setSubmitReviewError] = useState('');
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Fetch book details function
  const loadBook = useCallback(async () => {
    setIsLoadingBook(true);
    setErrorBook(null);
    try {
      const data = await fetchBookById(id);
      setBook(data);
    } catch (err) {
      setErrorBook(err.message || 'Failed to load book details.');
      console.error("API Error (Book):", err);
    } finally {
      setIsLoadingBook(false);
    }
  }, [id]);

  // Fetch book reviews function
  const loadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    setErrorReviews(null);
    try {
      const data = await fetchReviewsByBookId(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorReviews(err.message || 'Failed to load reviews.');
      console.error("API Error (Reviews):", err);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Handler for submitting a new review
  const handleReviewSubmit = async (reviewData) => {
    setSubmitReviewError('');
    try {
      const newReview = await submitNewReview(reviewData);
      setReviews([newReview, ...reviews]);
      await loadBook(); // Refresh book data
    } catch (err) {
      console.error("Failed to submit review:", err);
      setSubmitReviewError(err.message || 'Failed to submit review. Please try again.');
      throw err;
    }
  };

  // Using the Gutenberg image URL from the seed script
  const placeholderImageUrl = `https://placehold.co/400x600/e2e8f0/cbd5e0?text=Book+Cover`;

  if (isLoadingBook) return <LoadingSpinner />;
  if (errorBook) return <ErrorMessage message={errorBook} />;
  if (!book) return <ErrorMessage message="Book not found." />;

  // Use averageRating directly from book data (can be number or null)
  const averageRating = book.averageRating;

  return (
    <div className="max-w-7xl mx-auto">
      <Link 
        to="/books" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> 
        Back to Book List
      </Link>

      {/* Book Detail Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        {/* Top gradient accent */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <img 
                  src={book.coverImageUrl || placeholderImageUrl} 
                  alt={`Cover of ${book.title}`} 
                  className="w-full h-auto object-cover" 
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = placeholderImageUrl; 
                  }} 
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              {/* Rating Display */}
              <div className="flex items-center mb-6">
                <div className="flex items-center text-lg text-yellow-500 h-7 bg-yellow-50 px-3 py-4 rounded-full">
                  {typeof averageRating === 'number' ? (
                    <>
                      <Star className="w-5 h-5 mr-2 fill-current" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500 ml-1">/ 5</span>
                      <span className="ml-2 text-sm text-gray-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No ratings yet</span>
                  )}
                </div>
                
                {book.genre && (
                  <span className="ml-3 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {book.genre}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{book.description || 'No description available.'}</p>
              </div>
              
              {/* Book Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {book.isbn && (
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">ISBN</p>
                      <p className="text-sm font-medium text-gray-700">{book.isbn}</p>
                    </div>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Publisher</p>
                      <p className="text-sm font-medium text-gray-700">{book.publisher}</p>
                    </div>
                  </div>
                )}
                {book.publicationDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Published</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(book.publicationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-700"></div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
            Reader Reviews
          </h2>
          
          {/* Review loading/error/display */}
          {isLoadingReviews && <LoadingSpinner />}
          {errorReviews && <ErrorMessage message={errorReviews} />}
          
          {!isLoadingReviews && !errorReviews && (
            Array.isArray(reviews) && reviews.length > 0 ? (
              <div className="max-h-96 overflow-y-auto pr-2 mb-6 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center mb-6">
                <p className="text-gray-500">
                  No reviews yet. {isAuthenticated ? 'Be the first to write one!' : 'Log in to write a review.'}
                </p>
              </div>
            )
          )}

          {/* Conditionally Render Review Form */}
          {isAuthenticated ? (
            <>
              <ReviewForm bookId={id} onSubmitReview={handleReviewSubmit} />
              {submitReviewError && <ErrorMessage message={submitReviewError} />}
            </>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
              <p className="text-gray-700 mb-3">Share your thoughts about this book</p>
              <Link 
                to="/login" 
                state={{ from: location.pathname }} 
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Log in to write a review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;
