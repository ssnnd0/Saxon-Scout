import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  title, 
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerContent = null
}) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-md ${className}`}>
      {title && (
        <div className={`p-4 border-b border-gray-700 rounded-t-lg ${headerClassName}`}>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
      {footerContent && (
        <div className="p-4 border-t border-gray-700 rounded-b-lg bg-gray-800">
          {footerContent}
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
  footerContent: PropTypes.node
};

export default Card;