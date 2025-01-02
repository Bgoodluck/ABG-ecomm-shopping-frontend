import React, { useState } from 'react';
import { summaryApi } from '../../common';
import { useNavigate } from 'react-router-dom';

function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()



  const handleUnsubscribe = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
  
    try {
      const response = await fetch(summaryApi.unSubscribeNewsletter.url, {
        method: summaryApi.unSubscribeNewsletter.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Unsubscribe failed');
      }
  
      setMessage(data.message);
      setEmail(''); 
    } catch (error) {
      setMessage(error.message || 'Unsubscribe failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = () => {
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Unsubscribe</h2>
      <form onSubmit={handleUnsubscribe} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to unsubscribe"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
        </button>
      </form>
      <h3>Click to <span className='text-green-500 font-semibold cursor-pointer' onClick={handleReturn}>return</span></h3>
      {message && (
        <p className={`
          mt-4 text-center 
          ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}
        `}>
          {message}
        </p>
      )}
    </div>
  );
}

export default UnsubscribeForm;