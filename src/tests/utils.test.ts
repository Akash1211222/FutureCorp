import { describe, it, expect, beforeEach } from 'vitest';
import { validators, sanitizers } from '../utils/validation';
import { cache } from '../utils/cache';
import { SecurityUtils } from '../utils/security';

describe('Validation Utils', () => {
  describe('email validator', () => {
    it('should validate correct email formats', () => {
      expect(validators.email('test@example.com')).toBe(true);
      expect(validators.email('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validators.email('invalid-email')).toBe(false);
      expect(validators.email('@domain.com')).toBe(false);
      expect(validators.email('test@')).toBe(false);
    });
  });

  describe('password validator', () => {
    it('should validate strong passwords', () => {
      const result = validators.password('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validators.password('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('name validator', () => {
    it('should validate proper names', () => {
      expect(validators.name('John Doe')).toBe(true);
      expect(validators.name('Alice')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(validators.name('J')).toBe(false);
      expect(validators.name('John123')).toBe(false);
      expect(validators.name('')).toBe(false);
    });
  });
});

describe('Cache Utils', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('should store and retrieve data', () => {
    cache.set('test-key', { data: 'test' });
    const result = cache.get('test-key');
    expect(result).toEqual({ data: 'test' });
  });

  it('should respect TTL', async () => {
    cache.set('test-key', 'test-data', 100); // 100ms TTL
    expect(cache.get('test-key')).toBe('test-data');
    
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(cache.get('test-key')).toBeNull();
  });

  it('should delete specific keys', () => {
    cache.set('key1', 'data1');
    cache.set('key2', 'data2');
    
    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('data2');
  });
});

describe('Security Utils', () => {
  describe('input validation', () => {
    it('should validate email inputs', () => {
      expect(SecurityUtils.validateInput('test@example.com', 'email')).toBe(true);
      expect(SecurityUtils.validateInput('invalid-email', 'email')).toBe(false);
    });

    it('should validate password strength', () => {
      expect(SecurityUtils.validateInput('StrongPass123!', 'password')).toBe(true);
      expect(SecurityUtils.validateInput('weak', 'password')).toBe(false);
    });
  });

  describe('rate limiting', () => {
    it('should allow actions within limits', () => {
      expect(SecurityUtils.isRateLimited('test-action', 3, 1000)).toBe(false);
      expect(SecurityUtils.isRateLimited('test-action', 3, 1000)).toBe(false);
      expect(SecurityUtils.isRateLimited('test-action', 3, 1000)).toBe(false);
    });

    it('should block actions exceeding limits', () => {
      SecurityUtils.isRateLimited('test-action-2', 2, 1000);
      SecurityUtils.isRateLimited('test-action-2', 2, 1000);
      expect(SecurityUtils.isRateLimited('test-action-2', 2, 1000)).toBe(true);
    });
  });

  describe('URL validation', () => {
    it('should validate proper URLs', () => {
      expect(SecurityUtils.isValidUrl('https://example.com')).toBe(true);
      expect(SecurityUtils.isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(SecurityUtils.isValidUrl('javascript:alert(1)')).toBe(false);
      expect(SecurityUtils.isValidUrl('not-a-url')).toBe(false);
    });
  });
});