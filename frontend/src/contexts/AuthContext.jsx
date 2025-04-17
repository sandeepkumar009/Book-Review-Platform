import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '../services/api'; // Import API functions
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Effect to load user info from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        // Clear invalid stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false); 
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await apiLoginUser(credentials); 
      if (data.token && data.user) {
        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        navigate('/');
      } else {
        // Handle cases where backend response might be missing token/user
        throw new Error('Login failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Re-throw error to be caught by the login form component
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const data = await apiRegisterUser(userData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };


  // Logout function
  const logout = () => {
    // Clear token and user info from state and localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Value provided by the context
  const value = {
    user,
    token,
    isLoading, 
    login,
    logout,
    register,
    isAuthenticated: !!token && !!user, 
  };

  // Render children only after initial loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
