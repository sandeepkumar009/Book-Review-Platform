import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { UserPlus, Mail, Lock, User, CheckCircle } from 'lucide-react';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth(); // Use register function from context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            // Pass name, email, password to register function
            await register({ name, email, password });
            // AuthContext handles navigation on successful registration (to login page)
            // Optionally show a success message before redirect
        } catch (err) {
            // Error message comes from AuthContext/API call
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Card with gradient accent */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Top gradient accent */}
                <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
                            <UserPlus className="h-7 w-7 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Create Your Account</h1>
                        <p className="text-gray-500 mt-2">Join our community of book lovers</p>
                    </div>
                    
                    {error && <ErrorMessage message={error} />}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    required
                                    autoComplete="name"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    required
                                    autoComplete="email"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    required
                                    minLength="6"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    <CheckCircle className={`h-3 w-3 mr-1 ${password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                                    Must be at least 6 characters
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                                {password && confirmPassword && (
                                    <p className={`text-xs mt-1 flex items-center ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                        <CheckCircle className={`h-3 w-3 mr-1 ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`} />
                                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`mt-2 w-full py-3 px-4 flex justify-center items-center rounded-lg text-sm font-medium transition duration-300 ${
                                isLoading 
                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-150">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Terms text */}
            <div className="text-center mt-4 text-xs text-gray-500">
                <p>
                    By registering, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;