import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchUserProfile, updateUserProfile, fetchReviewsByUserId } from '../services/api';
import { User, Edit3, Star, Book, Calendar, Award, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Review card component with enhanced styling
function UserReviewItem({ review }) {
  const placeholderImageUrl = `/api/placeholder/60/90`;
  const book = review.book;
  if (!book) return null;
  
  return (
    <div className="flex items-start space-x-4 bg-white p-4 rounded-lg mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/books/${book._id}`} className="shrink-0">
        <img 
          src={book.coverImageUrl || placeholderImageUrl} 
          alt={`Cover of ${book.title}`} 
          className="w-14 h-20 object-cover rounded-md shadow" 
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
        />
      </Link>
      <div className="flex-1">
        <p className="font-semibold text-gray-800 mb-1">
          <Link to={`/books/${book._id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
            {book.title || 'Unknown Book'}
          </Link>
        </p>
        <div className="flex items-center text-sm text-yellow-600 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2 text-gray-600">{review.rating}/5</span>
          <span className="text-gray-400 mx-2">•</span>
          <span className="text-gray-500 text-xs flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700 text-sm">{review.comment}</p>
      </div>
    </div>
  );
}

function UserProfilePage() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' });
  const { user: loggedInUser, isAuthenticated } = useAuth();

  const isOwnProfile = isAuthenticated && loggedInUser?._id === userId;

  // Fetch user profile function
  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setError(null);
    try {
      const data = await fetchUserProfile(userId);
      setUserProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
      console.error("API Error (Profile):", err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId]);

  // Fetch user reviews function
  const loadUserReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      const reviewsData = await fetchReviewsByUserId(userId);
      setUserReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error("API Error (User Reviews):", err);
      // We don't set the main error here, just log it to not block profile display
    } finally {
      setIsLoadingReviews(false);
    }
  }, [userId]);

  // Fetch profile and reviews on mount or when userId changes
  useEffect(() => {
    loadProfile();
    loadUserReviews();
  }, [loadProfile, loadUserReviews]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: userProfile?.name || '',
        email: userProfile?.email || '',
        bio: userProfile?.bio || ''
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setError(null);
    try {
      const updatedProfileData = await updateUserProfile(userId, formData);
      setUserProfile(prev => ({ ...prev, ...updatedProfileData }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      console.error("API Error (Update Profile):", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Loading/Error states
  if (isLoadingProfile && !userProfile) return <LoadingSpinner />;
  if (error && !userProfile) return <ErrorMessage message={error} />;
  if (!userProfile) return <ErrorMessage message="User profile not found." />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header with Card and Gradient */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Top gradient accent - matches the LoginPage style */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userProfile.name || 'User Profile'}</h1>
                <p className="text-gray-500">Member since {new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            
            {isOwnProfile && (
              <button 
                onClick={handleEditToggle} 
                className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isEditing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            )}
          </div>

          {/* Display errors */}
          {error && <ErrorMessage message={error} className="mb-4" />}

          {isEditing && isOwnProfile ? (
            // Edit Form with enhanced styling
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                  required 
                  disabled={isLoadingProfile} 
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                  required 
                  disabled={isLoadingProfile} 
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                <textarea 
                  id="bio" 
                  name="bio" 
                  rows="4" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                  placeholder="Tell us about yourself and your reading preferences..." 
                  disabled={isLoadingProfile}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleEditToggle} 
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150" 
                  disabled={isLoadingProfile}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150" 
                  disabled={isLoadingProfile}
                >
                  {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            // Display Profile with improved layout
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Full Name</h2>
                  <p className="text-lg text-gray-800 font-medium">{userProfile.name || 'Not provided'}</p>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Email Address</h2>
                  <p className="text-lg text-gray-800">{userProfile.email || 'Not provided'}</p>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">About</h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-800 whitespace-pre-wrap">{userProfile.bio || 'No bio provided.'}</p>
                  </div>
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 h-fit">
                <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Reader Stats
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Reviews</span>
                    </div>
                    <span className="font-bold text-blue-700">{userReviews.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Avg Rating</span>
                    </div>
                    <span className="font-bold text-blue-700">
                      {userReviews.length 
                        ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                        : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                    <div className="flex items-center">
                      <Book className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Books Read</span>
                    </div>
                    <span className="font-bold text-blue-700">
                      {new Set(userReviews.map(review => review.book?._id)).size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Book Reviews
            </h2>
            
            {userReviews.length > 0 && (
              <Link to={`/books`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                Find more books <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
          
          {isLoadingReviews ? (
            <div className="py-8 text-center">
              <LoadingSpinner />
              <p className="text-gray-500 mt-4">Loading reviews...</p>
            </div>
          ) : userReviews.length > 0 ? (
            <div className="max-h-96 overflow-y-auto pr-2 mb-6 space-y-4">
              {userReviews.map(review => (
                <UserReviewItem key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
              <div className="bg-blue-50 inline-flex p-4 mb-4 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-4">
                {isOwnProfile 
                  ? "You haven't written any book reviews yet." 
                  : "This user hasn't written any book reviews yet."}
              </p>
              <Link 
                to="/books" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Books to Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;