// Security utilities for the frontend
export class SecurityUtils {
  // XSS prevention
  static sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Input validation
  static validateInput(input: string, type: 'email' | 'password' | 'name' | 'code'): boolean {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'password':
        return input.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(input);
      case 'name':
        return input.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(input);
      case 'code':
        return input.trim().length > 0 && input.length <= 10000;
      default:
        return false;
    }
  }

  // Rate limiting for client-side actions
  private static actionTimestamps = new Map<string, number[]>();

  static isRateLimited(action: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = this.actionTimestamps.get(action) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (validTimestamps.length >= maxAttempts) {
      return true;
    }
    
    validTimestamps.push(now);
    this.actionTimestamps.set(action, validTimestamps);
    return false;
  }

  // Secure token storage
  static setSecureToken(token: string): void {
    // In production, consider using secure HTTP-only cookies
    localStorage.setItem('accessToken', token);
  }

  static getSecureToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static clearSecureToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  // Content Security Policy helpers
  static isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  // Prevent clickjacking
  static preventClickjacking(): void {
    if (window.top !== window.self) {
      try {
        window.top!.location = window.self.location;
      } catch (e) {
        // Silently fail if we can't access parent frame (expected in iframes)
        document.body.style.display = 'none';
      }
    }
  }
}