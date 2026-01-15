import { describe, it, expect } from 'vitest';
import { validateRequired, validateEmail, validateName, validateForm } from './Validation';

describe('Validation Utils', () => {
  describe('validateRequired', () => {
    it('should return error for empty string', () => {
      const result = validateRequired('', 'Username');
      expect(result).toBe('Username is required');
    });

    it('should return error for whitespace only', () => {
      const result = validateRequired('   ', 'Email');
      expect(result).toBe('Email is required');
    });

    it('should return error for null', () => {
      const result = validateRequired(null, 'Password');
      expect(result).toBe('Password is required');
    });

    it('should return error for undefined', () => {
      const result = validateRequired(undefined, 'Name');
      expect(result).toBe('Name is required');
    });

    it('should return empty string for valid value', () => {
      const result = validateRequired('Valid Input', 'Field');
      expect(result).toBe('');
    });

    it('should use default field name when not provided', () => {
      const result = validateRequired('');
      expect(result).toBe('Field is required');
    });

    it('should return empty string for number zero', () => {
      const result = validateRequired(0, 'Age');
      expect(result).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should return empty string for empty value', () => {
      const result = validateEmail('');
      expect(result).toBe('');
    });

    it('should return error for invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return error for email without @', () => {
      const result = validateEmail('emailexample.com');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return error for email without domain', () => {
      const result = validateEmail('email@');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return error for email without extension', () => {
      const result = validateEmail('email@domain');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return empty string for valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result).toBe('');
    });

    it('should return empty string for valid email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result).toBe('');
    });

    it('should return empty string for valid email with numbers', () => {
      const result = validateEmail('user123@example.com');
      expect(result).toBe('');
    });
  });

  describe('validateName', () => {
    it('should return empty string for empty value', () => {
      const result = validateName('');
      expect(result).toBe('');
    });

    it('should return error for name too short', () => {
      const result = validateName('A', 'Username');
      expect(result).toBe('Username must be at least 2 characters long');
    });

    it('should return error for name too long', () => {
      const longName = 'a'.repeat(51);
      const result = validateName(longName, 'Username');
      expect(result).toBe('Username must not exceed 50 characters');
    });

    it('should return empty string for valid name', () => {
      const result = validateName('John Doe', 'Name');
      expect(result).toBe('');
    });

    it('should return empty string for minimum valid length', () => {
      const result = validateName('AB', 'Name');
      expect(result).toBe('');
    });

    it('should return empty string for maximum valid length', () => {
      const maxName = 'a'.repeat(50);
      const result = validateName(maxName, 'Name');
      expect(result).toBe('');
    });

    it('should use default field name when not provided', () => {
      const result = validateName('A');
      expect(result).toBe('Name must be at least 2 characters long');
    });
  });

  describe('validateForm', () => {
    it('should return no errors for valid form', () => {
      const values = {
        username: 'johndoe',
        email: 'john@example.com'
      };
      
      const schema = {
        username: (value) => validateRequired(value, 'Username'),
        email: (value) => validateEmail(value)
      };
      
      const result = validateForm(values, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid form', () => {
      const values = {
        username: '',
        email: 'invalid-email'
      };
      
      const schema = {
        username: (value) => validateRequired(value, 'Username'),
        email: (value) => validateEmail(value)
      };
      
      const result = validateForm(values, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('username');
      expect(result.errors).toHaveProperty('email');
    });

    it('should return only errors for invalid fields', () => {
      const values = {
        username: 'johndoe',
        email: 'invalid-email'
      };
      
      const schema = {
        username: (value) => validateRequired(value, 'Username'),
        email: (value) => validateEmail(value)
      };
      
      const result = validateForm(values, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).not.toHaveProperty('username');
      expect(result.errors).toHaveProperty('email');
    });

    it('should handle empty validation schema', () => {
      const values = {
        username: 'johndoe',
        email: 'john@example.com'
      };
      
      const result = validateForm(values, {});
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should validate multiple fields with multiple validators', () => {
      const values = {
        name: 'J',
        email: '',
        password: ''
      };
      
      const schema = {
        name: (value) => validateName(value, 'Name'),
        email: (value) => validateRequired(value, 'Email') || validateEmail(value),
        password: (value) => validateRequired(value, 'Password')
      };
      
      const result = validateForm(values, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('name');
      expect(result.errors).toHaveProperty('email');
      expect(result.errors).toHaveProperty('password');
    });
  });
});
