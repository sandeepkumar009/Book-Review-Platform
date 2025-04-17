import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <Frown className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
