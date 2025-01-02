import React, { useState } from 'react';
import { summaryApi } from '../../common';
import { useNavigate } from 'react-router-dom';

function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()



  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
  
    try {
      const response = await fetch(summaryApi.newsletterSubcription.url, {
        method: summaryApi.newsletterSubcription.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }
  
      setMessage(data.message);
      setEmail(''); // Clear input after successful subscription
    } catch (error) {
      setMessage(error.message || 'Subscription failed');
    } finally {
      setIsLoading(false);
    }
  }

  const handleUnsubscribe = () => {
    navigate('/unsubscribe')
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>
        Subscribe now & get 5% on your first 20,000 Naira purchase
      </p>
      <p className='text-slate-600 mt-3'>
        This offer applies to all categories, and it is available across multiple brands, 
        including new arrivals, seasonal trends, and popular brands. Terms and conditions 
        may apply, such as the exclusion of certain brands or items and minimum purchase requirements.
      </p>
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'
      >
        <input 
          className='w-full sm:flex-1 outline-none' 
          type="email" 
          placeholder='Enter your email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button 
          type='submit' 
          disabled={isLoading}
          className='bg-black-900 text-white-500 text-xs bg-gradient-to-r from-violet-300 to-blue-300 px-10 py-4 hover:bg-[#fd3da1] disabled:opacity-50'
        >
          {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>        
      </form>
      <h3>Click to <span className='text-red-500 font-semibold cursor-pointer' onClick={handleUnsubscribe}>unsubscribe</span></h3>
      {message && (
        <p className={`
          mt-2 text-sm 
          ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}
        `}>
          {message}
        </p>
      )}
    </div>
  )
}

export default NewsletterBox;