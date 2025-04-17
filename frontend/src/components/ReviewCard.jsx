import React from 'react';
import { Star, UserCircle, Calendar } from 'lucide-react';

function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transform transition-all duration-200 hover:shadow-md hover:border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-blue-50 p-2 rounded-full mr-3">
            <UserCircle className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-800">{review.user?.name || 'Anonymous'}</span>
        </div>
        <div className="flex items-center text-gray-500 text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className="mb-3 flex items-center">
        <div className="flex mr-2">
          {renderStars(review.rating)}
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
          {review.rating}/5
        </span>
      </div>
      
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
}

export default ReviewCard;
