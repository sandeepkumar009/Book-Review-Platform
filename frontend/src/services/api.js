// Define the base URL for the backend API
const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Adjust if needed

// Helper function for handling fetch responses
const handleResponse = async (response) => {
  if (response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    }
    return;
  } else {
    let errorData = { message: `HTTP error! status: ${response.status}` };
    try {
      const potentialErrorData = await response.json();
      if (potentialErrorData?.message) {
        errorData.message = potentialErrorData.message;
      }
    } catch (e) {
      console.warn("Could not parse error response JSON:", e);
    }
    throw new Error(errorData.message);
  }
};

// Function to get Auth Headers (using JWT from localStorage)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// --- API Functions ---

// Book related
export const fetchGenres = async () => {
  /* GET /books/genres */
  const response = await fetch(`${BASE_URL}/books/genres`);
  return handleResponse(response);
};

export const fetchFeaturedBooks = async () => {
  /* GET /books?limit=4 */
  const response = await fetch(`${BASE_URL}/books?limit=4`);
  return handleResponse(response);
};

export const fetchAllBooks = async ({ page = 1, limit = 10, search = '', genre = '' } = {}) => {
  /* GET /books */
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  if (genre) params.append('genre', genre);
  const response = await fetch(`${BASE_URL}/books?${params.toString()}`);
  return handleResponse(response);
};

export const fetchBookById = async (id) => {
  /* GET /books/:id */
  const response = await fetch(`${BASE_URL}/books/${id}`);
  return handleResponse(response);
};

// Review related
export const fetchReviewsByBookId = async (bookId) => {
  /* GET /reviews?bookId=... */
  if (!bookId) throw new Error("Book ID required");
  const response = await fetch(`${BASE_URL}/reviews?bookId=${bookId}`);
  return handleResponse(response);
};

export const submitNewReview = async (reviewData) => {
  /* POST /reviews */
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData)
  });
  return handleResponse(response);
};

// User related
export const fetchUserProfile = async (userId) => {
  /* GET /users/:id */
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  return handleResponse(response);
};

export const updateUserProfile = async (userId, profileData) => {
  /* PUT /users/:id */
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  /* POST /users/login */
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await handleResponse(response);
  if (!data.token || !data.user) {
    throw new Error("Login failed: Invalid server response.");
  }
  return data;
};

export const registerUser = async (userData) => {
  /* POST /users/register */
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

// --- NEW FUNCTION: Fetch reviews by user ID ---
export const fetchReviewsByUserId = async (userId) => {
  console.log(`API: Fetching reviews for user id ${userId} from backend...`);
  if (!userId) throw new Error("User ID is required to fetch user reviews.");
  // Assuming the backend route is /api/users/:userId/reviews
  const response = await fetch(`${BASE_URL}/users/${userId}/reviews`);
  return handleResponse(response);
};
