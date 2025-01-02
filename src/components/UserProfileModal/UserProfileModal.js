import React from 'react';

const ProfileModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center 
                 px-4 py-8 sm:px-6 lg:px-8 bg-slate-300 bg-opacity-50"
    >
      <div 
        className="relative w-full max-w-md mx-auto bg-white-300 rounded-lg shadow-xl 
                   transform transition-all duration-300 ease-in-out"
      >
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none 
                       transition duration-200 ease-in-out transform hover:scale-110 mt-14"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;