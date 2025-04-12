import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  autoClose = false,
  autoCloseTime = 5000, // 5 seconds
  showIcon = true
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer;
    if (autoClose) {
      timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, onClose]);

  if (!visible) return null;

  // Alert type styles
  const alertStyles = {
    info: 'bg-blue-900/50 border-blue-600 text-blue-200',
    success: 'bg-green-900/50 border-green-600 text-green-200',
    warning: 'bg-yellow-900/50 border-yellow-600 text-yellow-200',
    error: 'bg-red-900/50 border-red-600 text-red-200'
  };

  // Alert icons
  const alertIcons = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`border-l-4 p-4 rounded-r my-4 flex justify-between items-start ${alertStyles[type]}`}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {alertIcons[type]}
          </div>
        )}
        <div>
          <p className="text-sm leading-5">{message}</p>
        </div>
      </div>
      {onClose && (
        <button 
          onClick={handleClose} 
          className="ml-auto pl-3 -mr-1 -mt-1 text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  autoCloseTime: PropTypes.number,
  showIcon: PropTypes.bool
};

export default Alert;