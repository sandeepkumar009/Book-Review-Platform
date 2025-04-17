import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ErrorMessage({ message = "An error occurred. Please try again later." }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4 flex items-center" role="alert">
      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

export default ErrorMessage;
