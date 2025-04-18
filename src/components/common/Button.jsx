import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  type = 'button',
  fullWidth = false,
  className = '',
  icon = null,
  ...props 
}) => {
  // Base button styles
  let buttonClass = 'btn';
  
  // Variant styles
  switch (variant) {
    case 'primary':
      buttonClass += ' btn-primary';
      break;
    case 'secondary':
      buttonClass += ' btn-secondary';
      break;
    case 'outline':
      buttonClass += ' border border-primary-500 text-primary-600 hover:bg-primary-50';
      break;
    case 'danger':
      buttonClass += ' bg-red-500 text-white hover:bg-red-600';
      break;
    case 'success':
      buttonClass += ' bg-green-500 text-white hover:bg-green-600';
      break;
    case 'warning':
      buttonClass += ' bg-yellow-500 text-white hover:bg-yellow-600';
      break;
    case 'ghost':
      buttonClass += ' text-text-primary hover:bg-surface';
      break;
    case 'link':
      buttonClass += ' p-0 hover:underline text-primary-500 hover:text-primary-600';
      break;
    default:
      buttonClass += ' btn-primary';
  }
  
  // Size styles
  switch (size) {
    case 'xs':
      buttonClass += ' text-xs py-1 px-2';
      break;
    case 'sm':
      buttonClass += ' text-sm py-1.5 px-3';
      break;
    case 'md':
      buttonClass += ' text-sm py-2 px-4';
      break;
    case 'lg':
      buttonClass += ' text-base py-2.5 px-5';
      break;
    case 'xl':
      buttonClass += ' text-lg py-3 px-6';
      break;
    default:
      buttonClass += ' text-sm py-2 px-4';
  }
  
  // Full width
  if (fullWidth) {
    buttonClass += ' w-full';
  }
  
  // Disabled state
  if (disabled) {
    buttonClass += ' opacity-50 cursor-not-allowed';
  }
  
  // Custom className
  buttonClass += ` ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
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