import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  title, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  footer = null
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className={`border-b border-border pb-3 mb-4 font-medium text-lg ${headerClassName}`}>
          {title}
        </div>
      )}
      <div className={`${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="mt-4 pt-3 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footer: PropTypes.node
};

export default Card;