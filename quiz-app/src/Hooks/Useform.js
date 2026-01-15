import { useState, useCallback } from 'react';

export const useForm = ({ initialValues = {}, validationSchema = {}, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validationSchema[name]) {
      const error = validationSchema[name](value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  }, [validationSchema]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(validationSchema).forEach((field) => {
      const error = validationSchema[field](values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationSchema).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
    
    setIsSubmitting(false);
  }, [values, validationSchema, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
};
