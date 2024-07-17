/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success message
    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/Dashboard');
      }); // Delay to show success message before redirecting
    } catch (error) {
      setError('There was an error logging in!');
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/images/page.PNG')` }}>
      <div className="absolute w-900 h-800 right-7 transform -translate-x-70 -translate-y-1/9 bg-white bg-opacity-30 backdrop-filter backdrop-blur-xl rounded-lg p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-2xl mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Login
          </button>
          <div className="flex justify-between items-center mt-4">
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot Password?
            </a>
            <div className="text-sm text-gray-700">
              Don't have an account yet?{' '}
              <a href="/register" className="text-blue-500 hover:text-blue-600">
                Register for free
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
