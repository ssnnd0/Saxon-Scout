import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size = 'medium', color = 'blue', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    gray: 'text-gray-400',
    white: 'text-white'
  };

  const containerClasses = {
    small: '',
    medium: 'p-4',
    large: 'p-6'
  };

  return (
    <div className={`flex justify-center items-center ${containerClasses[size]} ${className}`}>
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['blue', 'gray', 'white']),
  className: PropTypes.string
};

export default Spinner;