// Input validation utilities
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  },

  code: (code: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (code.trim().length === 0) {
      errors.push('Code cannot be empty');
    }
    if (code.length > 10000) {
      errors.push('Code is too long (max 10,000 characters)');
    }

    return { valid: errors.length === 0, errors };
  }
};

// Sanitization utilities
export const sanitizers = {
  html: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  sql: (input: string): string => {
    return input.replace(/['"\\;]/g, '');
  },

  filename: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
};