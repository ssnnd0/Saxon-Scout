import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  fullWidth = false,
  icon = null
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
    info: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
    outline: 'bg-transparent border border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white'
  };

  // Size styles
  const sizeStyles = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };

  // Disabled style
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${disabledStyle}
        ${widthStyle}
        inline-flex justify-center items-center gap-2
        rounded-md
        font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
        transition duration-150 ease-in-out
        ${className}
      `}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node
};

export default Button;