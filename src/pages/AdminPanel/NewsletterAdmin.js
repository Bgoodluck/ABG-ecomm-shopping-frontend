import React, { useState, useEffect } from 'react';
import { summaryApi } from '../../common';

function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [newsletterContent, setNewsletterContent] = useState({
    subject: '',
    content: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'



  useEffect(() => {
    fetchSubscribers();
  }, [filter]);




  const fetchSubscribers = async () => {
  try {
    const response = await fetch(summaryApi.getNewsletterSubcription.url, {
      method: summaryApi.getNewsletterSubcription.method,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }
    
    const data = await response.json();

    let filteredSubscribers = data;

      if (filter === 'active') {
        filteredSubscribers = filteredSubscribers.filter(sub => sub.isActive);
      } else if (filter === 'inactive') {
        filteredSubscribers = filteredSubscribers.filter(sub => !sub.isActive);
      }

      setSubscribers(filteredSubscribers);
    
  } catch (error) {
    setMessage('Failed to fetch subscribers');
    setSubscribers([]); // Ensure subscribers is an array
  }
};




const handleDeleteSubscriber = async (email) => {
  try {
    await fetch(summaryApi.deleteSubscription.url.replace(':email', email), {
      method: summaryApi.deleteSubscription.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });

    setMessage(`Subscriber ${email} deleted successfully`);
    fetchSubscribers();
  } catch (error) {
    setMessage('Failed to delete subscriber');
  }
};





const toggleSubscriberStatus = async (email, currentStatus) => {
  try {
    await fetch(summaryApi.updateSubscriberStatus.url.replace(':email', email), {
      method: summaryApi.updateSubscriberStatus.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        isActive: !currentStatus
      })
    });
    
    setMessage(`Subscriber ${email} ${currentStatus ? 'deactivated' : 'activated'}`);
    fetchSubscribers();
  } catch (error) {
    setMessage('Failed to update subscriber status');
  }
};




const sendNewsletterHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
  
    try {
      const response = await fetch(
        summaryApi.sendNewsletterSubcription.url, 
        {
          method: summaryApi.sendNewsletterSubcription.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsletterContent),
          credentials: 'include'
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send newsletter');
      }
  
      setMessage(`Newsletter sent to ${data.recipientCount} subscribers`);
      // Reset form
      setNewsletterContent({ subject: '', content: '' });
    } catch (error) {
      setMessage(error.message || 'Failed to send newsletter');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-black-900 font-bold mb-6">Newsletter Management</h1>

      <div className="mb-4 flex items-center space-x-4">
        <label className="font-medium">Filter Subscribers:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Subscribers</option>
          <option value="active">Active Subscribers</option>
          <option value="inactive">Inactive Subscribers</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Subscribers List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black-900">
            Subscribers ({subscribers.length})
          </h2>
          <div className="max-h-96 overflow-y-auto border rounded">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="border-b">
                    <td className="p-2">{subscriber.email}</td>
                    <td className="p-2">
                      <span 
                        className={`
                          px-2 py-1 rounded text-xs 
                          ${subscriber.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}
                        `}
                      >
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-2 space-x-2">
                      <button 
                        onClick={() => toggleSubscriberStatus(subscriber.email, subscriber.isActive)}
                        className={`
                          px-2 py-1 rounded text-xs 
                          ${subscriber.isActive 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'}
                        `}
                      >
                        {subscriber.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteSubscriber(subscriber.email)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Newsletter Composition */}
        <div>
          <h2 className="text-xl font-semibold text-black-900 mb-4">Compose Newsletter</h2>
          <form onSubmit={sendNewsletterHandler} className="space-y-4">
            <div>
              <label className="block mb-2">Subject</label>
              <input
                type="text"
                value={newsletterContent.subject}
                onChange={(e) => setNewsletterContent({
                  ...newsletterContent, 
                  subject: e.target.value
                })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Newsletter Content</label>
              <textarea
                value={newsletterContent.content}
                onChange={(e) => setNewsletterContent({
                  ...newsletterContent, 
                  content: e.target.value
                })}
                className="w-full p-2 border rounded h-48"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Newsletter'}
            </button>
          </form>
          {message && (
        <div className={`
          mt-4 p-3 rounded text-center 
          ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {message}
        </div>
      )}
    </div>
      </div>
    </div>
  );
}

export default NewsletterAdmin;