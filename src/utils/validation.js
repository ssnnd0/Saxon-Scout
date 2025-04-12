/**
 * Validation Service
 * Provides validation functions for form inputs
 */

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return 'Username is required';
  }
  
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  
  return null;
};

// Team number validation
export const validateTeamNumber = (teamNumber) => {
  if (!teamNumber) {
    return 'Team number is required';
  }
  
  const num = parseInt(teamNumber);
  if (isNaN(num) || num <= 0 || num > 9999) {
    return 'Team number must be between 1 and 9999';
  }
  
  return null;
};

// Match number validation
export const validateMatchNumber = (matchNumber) => {
  if (!matchNumber) {
    return 'Match number is required';
  }
  
  const num = parseInt(matchNumber);
  if (isNaN(num) || num <= 0) {
    return 'Match number must be a positive number';
  }
  
  return null;
};

// Validate numeric field
export const validateNumeric = (value, options = {}) => {
  const { required = false, min, max, integer = true } = options;
  
  if (required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }
  
  if (value === null || value === undefined || value === '') {
    return null; // Empty is valid for non-required fields
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  
  if (integer && !Number.isInteger(num)) {
    return 'Please enter a whole number';
  }
  
  if (min !== undefined && num < min) {
    return `Value must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `Value must be at most ${max}`;
  }
  
  return null;
};

// Check if a value is empty
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

// General text input validation
export const validateText = (value, options = {}) => {
  const { required = false, minLength, maxLength } = options;
  
  if (required && isEmpty(value)) {
    return 'This field is required';
  }
  
  if (isEmpty(value)) {
    return null; // Empty is valid for non-required fields
  }
  
  if (typeof value !== 'string') {
    return 'Invalid input type';
  }
  
  if (minLength !== undefined && value.length < minLength) {
    return `Input must be at least ${minLength} characters`;
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    return `Input must be at most ${maxLength} characters`;
  }
  
  return null;
};

// Validate form data object
export const validateForm = (data, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = data[field];
    const rule = validationRules[field];
    
    // Apply validation rule
    if (typeof rule === 'function') {
      const error = rule(value, data);
      if (error) errors[field] = error;
    }
  });
  
  return errors;
};