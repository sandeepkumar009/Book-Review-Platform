import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, User, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <nav className="flex flex-col md:flex-row md:justify-between md:items-center py-4">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center group">
              <BookOpen className="mr-2 h-7 w-7 transition-transform group-hover:rotate-12 duration-300" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">BookReview</span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Navigation Links - Mobile (Slide down menu) */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="flex flex-col space-y-2 pb-4">
              {/* Common Links */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                    ? 'text-white bg-blue-600 shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                    ? 'text-white bg-blue-600 shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Books
              </NavLink>

              {/* Auth Based Navigation */}
              {isAuthenticated && user ? (
                <>
                  <NavLink
                    to={`/profile/${user._id}`}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                        ? 'text-white bg-blue-600 shadow-md'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-1 h-4 w-4" /> Profile
                  </NavLink>

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                        ? 'text-white bg-blue-600 shadow-md'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="mr-1 h-4 w-4" /> Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                        ? 'text-white bg-blue-600 shadow-md'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="mr-1 h-4 w-4" /> Register
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {/* Common Links */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                  ? 'text-white bg-blue-600 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                  ? 'text-white bg-blue-600 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              Books
            </NavLink>

            {/* Auth Based Navigation */}
            {isAuthenticated && user ? (
              <>
                <NavLink
                  to={`/profile/${user._id}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                      ? 'text-white bg-blue-600 shadow-md'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  <User className="mr-1 h-4 w-4" /> Profile
                </NavLink>

                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                      ? 'text-white bg-blue-600 shadow-md'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-3 py-2 ml-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isActive
                      ? 'text-white bg-blue-600 shadow-md'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`
                  }
                >
                  <UserPlus className="mr-1 h-4 w-4" /> Register
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;