import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

function ReviewForm({ bookId, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleMouseOver = (rate) => {
    setHoverRating(rate);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      setError('Please provide both a rating and a comment.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      // Call the passed onSubmitReview function (which would handle the API call)
      await onSubmitReview({ bookId, rating, comment });
      // Reset form after successful submission
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-blue-100 rounded-lg bg-blue-50 p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <Star className="w-5 h-5 mr-2 text-blue-600" />
        Write Your Review
      </h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating:</label>
        <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                  (hoverRating || rating) >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => handleMouseOver(star)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
          <span className="ml-3 text-gray-600 font-medium">
            {rating > 0 ? `${rating} out of 5 stars` : 'Select your rating'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review:
        </label>
        <textarea
          id="comment"
          name="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Share your thoughts about the book..."
          required
          disabled={isSubmitting}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-lg shadow-md text-white font-medium transition duration-300 flex items-center justify-center ${
          isSubmitting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
      >
        {isSubmitting ? 'Submitting...' : (
          <>
            Submit Review
            <Send className="ml-2 w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default ReviewForm;
