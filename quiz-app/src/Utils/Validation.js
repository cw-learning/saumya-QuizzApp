export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateEmail = (value) => {
  if (!value) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validateName = (value, fieldName = 'Name') => {
  if (!value) return '';
  
  if (value.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  
  if (value.length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }
  
  return '';
};

export const validateForm = (values, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach((field) => {
    const validator = validationSchema[field];
    const error = validator(values[field]);
    
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
