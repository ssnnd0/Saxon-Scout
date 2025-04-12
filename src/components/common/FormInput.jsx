import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false, 
  error = null, 
  disabled = false,
  className = '',
  min,
  max,
  step,
  options = [],
  multiple = false,
  rows = 3,
  helpText,
  onBlur,
  autoComplete = 'on',
  readOnly = false
}) => {
  const baseInputClasses = `
    px-3 py-2 rounded-md border bg-gray-700 text-gray-100
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'}
    focus:outline-none focus:ring-1
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    w-full
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            rows={rows}
            className={`${baseInputClasses} ${className}`}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
          />
        );

      case 'select':
        return (
          <select
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`${baseInputClasses} ${className}`}
            required={required}
            multiple={multiple}
            aria-invalid={error ? 'true' : 'false'}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={id}
              checked={!!value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              className={`h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 ${className}`}
              required={required}
              aria-invalid={error ? 'true' : 'false'}
            />
            {label && <span className="ml-2 text-sm text-gray-300">{label}</span>}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  name={id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  className={`h-4 w-4 border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 ${className}`}
                  required={required}
                  aria-invalid={error ? 'true' : 'false'}
                />
                <label htmlFor={`${id}-${option.value}`} className="ml-2 text-sm text-gray-300">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`${baseInputClasses} ${className}`}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={error ? 'true' : 'false'}
          />
        );

      default:
        return (
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`${baseInputClasses} ${className}`}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={error ? 'true' : 'false'}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${type === 'checkbox' ? '' : 'space-y-1'}`}>
      {type !== 'checkbox' && label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {helpText && !error && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  multiple: PropTypes.bool,
  rows: PropTypes.number,
  helpText: PropTypes.string,
  onBlur: PropTypes.func,
  autoComplete: PropTypes.string,
  readOnly: PropTypes.bool
};

export default FormInput;