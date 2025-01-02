// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import io from 'socket.io-client';
// import { Send, MessageCircle } from 'lucide-react';
// import { summaryApi } from '../../common';
// import { useSelector } from 'react-redux';

// const LiveChat = ({ userId, userName, userEmail }) => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
  

//   const user = useSelector((state) => state.user.user);
//   const userToken = useSelector((state) => state.user.token) || localStorage.getItem('token');
  


// //   const userToken = useMemo(() => {
// //     console.log('User object:', user);
// //     return user?.token || (user && localStorage.getItem('userToken'));
// //   }, [user]);



//  // Establish socket connection
// useEffect(() => {
//     if (userToken) {
//       console.log('Attempting to create socket connection');
//       console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
//       console.log('User Token:', user.token);
//       console.log('User:', user);
//       console.log('Token:', userToken);
  
//       console.log('Creating socket with token:', userToken);
//       const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
//         auth: {
//           token: userToken
//         },
//         credentials: "include"
//       });
  
//       setSocket(newSocket);
  
//       // Socket event listeners
//       newSocket.on('connect', () => {
//         console.log('Socket connected successfully');
//         console.log('Socket ID:', newSocket.id);
//       });
  
//       newSocket.on('connect_error', (error) => {
//         console.error('Socket connection error:', error);
//         console.log('Error details:', {
//           message: error.message,
//           name: error.name,
//           stack: error.stack
//         });
//       });
  
//       newSocket.on('receive_message', (message) => {
//         setMessages(prevMessages => [...prevMessages, message]);
//       });
  
//       newSocket.on('typing', (data) => {
//         setIsTyping(data.isTyping);
//       });
  
//       // Fetch chat history
//       const fetchChatHistory = async () => {
//         try {
//           const actualUserId = user?._id || userId || 'defaultUserId';
//           const response = await fetch(
//             `${summaryApi.chatMessageAssistant.url.replace(':userId', actualUserId)}`,
//             {
//               method: summaryApi.chatMessageAssistant.method,
//               credentials: 'include',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${userToken}`
//               }
//             }
//           );
  
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
  
//           const data = await response.json();
//           setMessages(data.messages || []);
//         } catch (error) {
//           console.error('Error fetching chat history:', error);
//         }
//       };
  
//       fetchChatHistory();
  
//       return () => newSocket.disconnect();
//     }
//   }, [userToken, userId]); // Dependency on user ensures socket reconnects if user changes

//   // Handle message sending
//   const handleSendMessage = () => {
//     console.log('Send Message Called');
//     console.log('Input Message:', inputMessage);
//     console.log('Socket:', socket);
//     console.log('User:', user);

//     if (inputMessage.trim() && socket) {
//       const messageData = {
//         sender: user?.firstName || userName,
//         message: inputMessage,
//         customerInfo: {
//           userId: user?._id,
//           name: user?.firstName || userName,
//           email: user?.email || userEmail
//         }
//       };

//       console.log('Sending Message Data:', messageData);

//       socket.emit('send_message', messageData, (error) => {
//         if (error) {
//           console.error('Message Send Error:', error);
//         } else {
//           console.log('Message sent successfully');
//           setInputMessage('');
//         }
//       });
//     } else {
//       console.warn('Cannot send message - missing input or socket');
//       if (!socket) {
//         console.warn('Socket is not connected. Ensure user is logged in and Redux state is populated.');
//       }
//     }
//   };


//   // Handle typing indicator
//   const handleTyping = (e) => {
//     setInputMessage(e.target.value);

//     if (socket) {
//       socket.emit('typing', { userId, isTyping: true });

//       // Clear previous timeout
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }

//       // Set new timeout
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit('typing', { userId, isTyping: false });
//       }, 1000);
//     }
//   };

//   // Render chat messages
//   const renderMessages = () => {
//     return messages.map((msg, index) => (
//       <div 
//         key={index} 
//         className={`mb-2 p-2 rounded-lg max-w-[80%] ${
//           msg.sender === userName 
//             ? 'bg-blue-100 self-end ml-auto' 
//             : 'bg-gray-100 self-start mr-auto'
//         }`}
//       >
//         <div className="font-semibold text-sm">{msg.sender}</div>
//         <div>{msg.message}</div>
//         <div className="text-xs text-gray-500">
//           {new Date(msg.timestamp).toLocaleTimeString()}
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Chat Icon */}
//       {!isChatOpen && (
//         <button 
//           onClick={() => setIsChatOpen(true)} 
//           className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
//         >
//           <MessageCircle />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isChatOpen && (
//         <div className="w-[350px] bg-white border rounded-lg shadow-xl flex flex-col">
//           {/* Chat Header */}
//           <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
//             <h3 className="font-semibold">Customer Support</h3>
//             <button 
//               onClick={() => setIsChatOpen(false)} 
//               className="text-white hover:text-gray-200"
//             >
//               Close
//             </button>
//           </div>

//           {/* Messages Container */}
//           <div className="flex-grow overflow-y-auto p-3 space-y-2">
//             {renderMessages()}
//             {isTyping && (
//               <div className="text-gray-500 italic">
//                 Support agent is typing...
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-3 border-t flex items-center">
//             <input 
//               type="text" 
//               value={inputMessage}
//               onChange={handleTyping}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Type a message..."
//               className="flex-grow mr-2 p-2 border rounded"
//             />
//             <button 
//               onClick={handleSendMessage}
//               className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             >
//               <Send size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveChat;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import io from 'socket.io-client';
// import { Send, MessageCircle, X } from 'lucide-react';
// import { summaryApi } from '../../common';
// import { useSelector } from 'react-redux';

// const LiveChat = ({ userId, userName, userEmail }) => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [operatorAlert, setOperatorAlert] = useState(null);
//   const [isAiProcessing, setIsAiProcessing] = useState(false);

//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const user = useSelector((state) => state.user.user);
//   const userToken = useSelector((state) => state.user.token) || localStorage.getItem('token');

//   // Scroll to bottom when messages change
//   const scrollToBottom = useCallback(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   // Fetch Chat History using summaryApi
//   const fetchChatHistory = useCallback(async () => {
//     try {
//       const actualUserId = user?._id || userId || 'defaultUserId';
//       const response = await fetch(
//         `${summaryApi.chatMessageAssistant.url.replace(':userId', actualUserId)}`,
//         {
//           method: summaryApi.chatMessageAssistant.method,
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${userToken}`
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setMessages(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching chat history:', error);
//     }
//   }, [user, userId, userToken]);

//   const generateAIResponse = async (userMessage) => {
//     try {
//       setIsAiProcessing(true);
      
//       const response = await fetch(summaryApi.openAi.url, {
//         method: summaryApi.openAi.method,
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ message: userMessage })
//       });
  
//       if (!response.ok) {
//         const errorBody = await response.text();
//         console.error('Server Error Response:', errorBody);
//         throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
//       }
  
//       const data = await response.json();
//       return data.message;
//     } catch (error) {
//       console.error('Full AI Response Error:', error);
//       return "I'm experiencing technical difficulties. Please try again.";
//     } finally {
//       setIsAiProcessing(false);
//     }
//   };



//   useEffect(() => {
//     if (userToken) {
//       const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
//         auth: { token: userToken },
//         credentials: 'include',
//       });

//       setSocket(newSocket);

//       // Fetch chat history on connection
//       fetchChatHistory();

//       // Existing socket event handlers...
//       newSocket.on('receive_message', (message) => {
//         setMessages((prev) => [...prev, message]);
//         scrollToBottom();
//       });

//       // Operator alerts
//       newSocket.on('operator_alert', (alert) => {
//         setOperatorAlert(alert.message);
//         setTimeout(() => setOperatorAlert(null), 5000);
//       });

//       return () => newSocket.disconnect();
//     }
//   }, [userToken, userId, scrollToBottom, fetchChatHistory]);

//   const handleSendMessage = async () => {
//     if (inputMessage.trim() && socket) {
//       // Static Predefined Responses
//       const predefinedResponses = {
//         'hello': "Hi there! How can I help you today?",
//         'hi': "Hello! Welcome to our support chat.",
//         'help': "Sure, I'm here to assist you. What do you need help with?",
//         'pricing': "Our pricing details are available on our website. Would you like me to provide more information?"
//       };

//       const lowercaseMessage = inputMessage.toLowerCase();
//       const predefinedResponse = Object.keys(predefinedResponses).find(key => 
//         lowercaseMessage.includes(key)
//       );

//       const messageData = {
//         sender: user?.firstName || userName,
//         message: inputMessage,
//         customerInfo: {
//           userId: user?._id,
//           name: user?.firstName || userName,
//           email: user?.email || userEmail,
//         },
//         type: 'customer'
//       };

//       // Send user's message
//       socket.emit('send_message', messageData);
//       setInputMessage('');

//       // Check for predefined response first
//       if (predefinedResponse) {
//         const botResponse = {
//           sender: 'Support Bot',
//           message: predefinedResponses[predefinedResponse],
//           type: 'support'
//         };
//         socket.emit('send_message', botResponse);
//         return;
//       }

//       // If no predefined response, generate AI response
//       try {
//         const aiResponse = await generateAIResponse(inputMessage);
//         const aiMessageData = {
//           sender: 'AI Assistant',
//           message: aiResponse,
//           type: 'support',
//           timestamp: new Date(),
//         };

//         socket.emit('send_message', aiMessageData);
//       } catch (error) {
//         console.error('AI Response Error:', error);
//       }
//     }
//   };

//   const renderMessages = () =>
//     messages.map((msg, index) => (
//       <div
//         key={index}
//         className={`mb-2 p-2 rounded-lg max-w-[80%] ${
//           msg.sender === (user?.firstName || userName)
//             ? 'bg-blue-100 self-end ml-auto'
//             : 'bg-slate-100 self-start mr-auto'
//         }`}
//       >
//         <div className="font-semibold text-sm">{msg.sender}</div>
//         <div>{msg.message}</div>
//         <div className="text-xs text-slate-700">
//           {new Date(msg.timestamp).toLocaleTimeString()}
//         </div>
//       </div>
//     ));



//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Operator Alerts */}
//       {operatorAlert && (
//         <div className="bg-red-500 text-white-500 p-3 rounded-lg mb-2">
//           {operatorAlert}
//         </div>
//       )}

//       {/* Chat Icon */}
//       {!isChatOpen && (
//         <button 
//           onClick={() => setIsChatOpen(true)} 
//           className="bg-blue-500 text-white-500 p-3 rounded-full shadow-lg hover:bg-blue-600"
//         >
//           <MessageCircle />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isChatOpen && (
//         <div className="w-[350px] bg-white-500 border rounded-lg shadow-xl flex flex-col">
//           {/* Chat Header with Close Button */}
//           <div className="bg-blue-500 text-white-500 p-3 rounded-t-lg flex justify-between items-center">
//             <h3 className="font-semibold flex-grow">Customer Support</h3>
//             <button 
//               onClick={() => setIsChatOpen(false)} 
//               className="text-white-500 hover:text-gray-200"
//               aria-label="Close Chat"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Messages Container with Fixed Height and Scrolling */}
//           <div 
//             ref={messagesContainerRef}
//             className="flex-grow overflow-y-auto p-3 space-y-2 max-h-[400px]"
//           >
//             {renderMessages()}
//             {isTyping && (
//               <div className="text-gray-500 italic">
//                 Someone is typing...
//               </div>
//             )}
//             {isAiProcessing && (
//               <div className="text-gray-500 italic">
//                 AI is generating a response...
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-3 border-t flex items-center">
//             <input 
//               type="text" 
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Type a message..."
//               className="flex-grow mr-2 p-2 border rounded"
//               disabled={isAiProcessing}
//             />
//             <button 
//               onClick={handleSendMessage}
//               className="bg-blue-500 text-white-500 p-2 rounded hover:bg-blue-600"
//               disabled={isAiProcessing || !inputMessage.trim()}
//             >
//               <Send size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveChat;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { Send, MessageCircle, X, RefreshCw } from 'lucide-react';
import { summaryApi } from '../../common';
import { useSelector } from 'react-redux';

const LiveChat = ({ userId, userName, userEmail }) => {
  // LiveChat state
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [operatorAlert, setOperatorAlert] = useState(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Chat Mode State
  const [chatMode, setChatMode] = useState('livechat'); // 'livechat' or 'botpress'

  // Botpress state
  const [isBotpressInitialized, setIsBotpressInitialized] = useState(false);
  const [botpressError, setBotpressError] = useState(null);
  const webchatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const user = useSelector((state) => state.user.user);
  const userToken = useSelector((state) => state.user.token) || localStorage.getItem('token');

  // Scroll to bottom method
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Fetch Chat History
  const fetchChatHistory = useCallback(async () => {
    try {
      const actualUserId = user?._id || userId || 'defaultUserId';
      const response = await fetch(
        `${summaryApi.chatMessageAssistant.url.replace(':userId', actualUserId)}`,
        {
          method: summaryApi.chatMessageAssistant.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, [user, userId, userToken]);

  // Generate AI Response
  const generateAIResponse = async (userMessage) => {
    try {
      setIsAiProcessing(true);
      
      const response = await fetch(summaryApi.openAi.url, {
        method: summaryApi.openAi.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Server Error Response:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
  
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Full AI Response Error:', error);
      return "I'm experiencing technical difficulties. Please try again.";
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Initialize Botpress
  const initializeBotpress = useCallback(() => {
    // Reset previous state
    setIsBotpressInitialized(false);
    setBotpressError(null);

    // Ensure we have the necessary elements and script
    if (!window.BotpressWebChat) {
      setBotpressError('Botpress WebChat script not loaded');
      return;
    }

    if (!webchatContainerRef.current) {
      setBotpressError('Webchat container not found');
      return;
    }

    try {
      // Clear any existing Botpress instances
      if (webchatContainerRef.current) {
        webchatContainerRef.current.innerHTML = '';
      }

      // Initialize Botpress
      window.BotpressWebChat.default({
        host: process.env.REACT_APP_BOTPRESS_HOST || 'https://your-botpress-instance.com',
        clientId: process.env.REACT_APP_BOTPRESS_CLIENT_ID || 'your-client-id',
        userId: user?._id || userId || 'user-123',
        containerEl: webchatContainerRef.current,
        // Additional configuration options
        onError: (error) => {
          console.error('Botpress Initialization Error:', error);
          setBotpressError('Failed to initialize Botpress');
        }
      });

      setIsBotpressInitialized(true);
    } catch (error) {
      console.error('Botpress Initialization Error:', error);
      setBotpressError('Failed to initialize Botpress');
    }
  }, [user, userId]);

  // Combined initialization effect
  useEffect(() => {
    // LiveChat Socket Initialization
    if (userToken) {
      const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
        auth: { token: userToken },
        credentials: 'include',
      });

      setSocket(newSocket);

      // Fetch chat history on connection
      fetchChatHistory();

      // Socket event handlers
      newSocket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      // Operator alerts
      newSocket.on('operator_alert', (alert) => {
        setOperatorAlert(alert.message);
        setTimeout(() => setOperatorAlert(null), 5000);
      });

      // Try to initialize Botpress when socket is ready
      initializeBotpress();

      // Cleanup
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userToken, userId, fetchChatHistory, scrollToBottom, initializeBotpress]);

  // Render messages method
  const renderMessages = () =>
    messages.map((msg, index) => (
      <div
        key={index}
        className={`mb-2 p-2 rounded-lg max-w-[80%] ${
          msg.sender === (user?.firstName || userName)
            ? 'bg-blue-100 self-end ml-auto'
            : 'bg-slate-100 self-start mr-auto'
        }`}
      >
        <div className="font-semibold text-sm">{msg.sender}</div>
        <div>{msg.message}</div>
        <div className="text-xs text-slate-700">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </div>
      </div>
    ));

  // Send message handler
  const handleSendMessage = async () => {
    if (inputMessage.trim() && socket) {
      // Static Predefined Responses
      const predefinedResponses = {
        'hello': "Hi there! How can I help you today?",
        'hi': "Hello! Welcome to our support chat.",
        'help': "Sure, I'm here to assist you. What do you need help with?",
        'pricing': "Our pricing details are available on our website. Would you like me to provide more information?"
      };

      const lowercaseMessage = inputMessage.toLowerCase();
      const predefinedResponse = Object.keys(predefinedResponses).find(key => 
        lowercaseMessage.includes(key)
      );

      const messageData = {
        sender: user?.firstName || userName,
        message: inputMessage,
        customerInfo: {
          userId: user?._id,
          name: user?.firstName || userName,
          email: user?.email || userEmail,
        },
        type: 'customer'
      };

      // Send user's message
      socket.emit('send_message', messageData);
      setInputMessage('');

      // Check for predefined response first
      if (predefinedResponse) {
        const botResponse = {
          sender: 'Support Bot',
          message: predefinedResponses[predefinedResponse],
          type: 'support'
        };
        socket.emit('send_message', botResponse);
        return;
      }

      // If no predefined response, generate AI response
      try {
        const aiResponse = await generateAIResponse(inputMessage);
        const aiMessageData = {
          sender: 'AI Assistant',
          message: aiResponse,
          type: 'support',
          timestamp: new Date(),
        };

        socket.emit('send_message', aiMessageData);
      } catch (error) {
        console.error('AI Response Error:', error);
      }
    }
  };

  // Render chat interface
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Operator Alerts */}
      {operatorAlert && (
        <div className="bg-red-500 text-white-500 p-3 rounded-lg mb-2">
          {operatorAlert}
        </div>
      )}

      {/* Chat Icon */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)} 
          className="bg-blue-500 text-white-500 p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          <MessageCircle />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="w-[450px] bg-white-500 border rounded-lg shadow-xl flex flex-col">
          {/* Chat Header with Close Button */}
          <div className="bg-blue-500 text-white-500 p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold flex-grow">Customer Support</h3>
            <button 
              onClick={() => setIsChatOpen(false)} 
              className="text-white-500 hover:text-gray-200 mr-2"
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs for Different Chat Modes */}
          <div className="flex border-b">
            <button 
              className={`flex-1 p-2 text-center border-r ${
                chatMode === 'livechat' ? 'bg-blue-100' : ''
              }`}
              onClick={() => setChatMode('livechat')}
            >
              LiveChat
            </button>
            <button 
              className={`flex-1 p-2 text-center ${
                chatMode === 'botpress' ? 'bg-blue-100' : ''
              }`}
              onClick={() => setChatMode('botpress')}
            >
              AI Assistant
            </button>
          </div>

          {/* Messages Container with Fixed Height and Scrolling */}
          <div 
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto p-3 space-y-2 max-h-[400px] relative"
          >
            {/* LiveChat Mode */}
            {chatMode === 'livechat' && (
              <>
                {renderMessages()}
                {isTyping && (
                  <div className="text-gray-500 italic">
                    Someone is typing...
                  </div>
                )}
                {isAiProcessing && (
                  <div className="text-gray-500 italic">
                    AI is generating a response...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}

            {/* Botpress Mode */}
            {chatMode === 'botpress' && (
              <div className="w-full h-full">
                {botpressError ? (
                  <div className="text-red-500 p-4 text-center">
                    <p>{botpressError}</p>
                    <button 
                      onClick={initializeBotpress}
                      className="mt-2 bg-blue-500 text-white p-2 rounded flex items-center justify-center mx-auto"
                    >
                      <RefreshCw className="mr-2" size={16} /> Retry Initialization
                    </button>
                  </div>
                ) : (
                  <div 
                    ref={webchatContainerRef} 
                    className={`w-full h-full ${
                      isBotpressInitialized ? 'block' : 'hidden'
                    }`} 
                  />
                )}
              </div>
            )}
          </div>

          {/* Input Area - Only for LiveChat Mode */}
          {chatMode === 'livechat' && (
            <div className="p-3 border-t flex items-center">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-grow mr-2 p-2 border rounded"
                disabled={isAiProcessing}
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-500 text-white-500 p-2 rounded hover:bg-blue-600"
                disabled={isAiProcessing || !inputMessage.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveChat;