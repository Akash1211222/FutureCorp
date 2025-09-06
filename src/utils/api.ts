import { cache, withCache } from './cache';
import { PerformanceMonitor } from './performance';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export interface ApiError {
  message: string;
  errors?: any[];
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const timer = PerformanceMonitor.startTimer(`api_${endpoint}`);
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          cache.clear(); // Clear cache on auth failure
          window.location.href = '/login';
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      timer(); // Record performance metric
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection and ensure Supabase is configured correctly.');
      }
      timer(); // Record even failed requests
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Users methods
  getUsers = withCache(
    () => this.request('/users'),
    () => 'users_all',
    2 * 60 * 1000 // 2 minutes cache
  );

  getStudents = withCache(
    () => this.request('/users/students'),
    () => 'users_students',
    2 * 60 * 1000
  );

  async getUserStats(userId: string) {
    return this.request(`/users/${userId}/stats`);
  }

  // Assignments methods with caching
  getAssignments = withCache(
    () => this.request('/assignments'),
    () => 'assignments_all',
    5 * 60 * 1000 // 5 minutes cache
  );

  getAssignmentById = withCache(
    (id: string) => this.request(`/assignments/${id}`),
    (id: string) => `assignment_${id}`,
    10 * 60 * 1000 // 10 minutes cache
  );

  async createAssignment(assignmentData: any) {
    const result = await this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
    // Invalidate assignments cache
    cache.delete('assignments_all');
    return result;
  }

  async submitSolution(data: { assignmentId: string; code: string }) {
    return this.request('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Classes methods with caching
  getClasses = withCache(
    () => this.request('/classes'),
    () => 'classes_all',
    3 * 60 * 1000 // 3 minutes cache
  );

  getClassById = withCache(
    (id: string) => this.request(`/classes/${id}`),
    (id: string) => `class_${id}`,
    5 * 60 * 1000
  );

  async createClass(classData: any) {
    const result = await this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
    // Invalidate classes cache
    cache.delete('classes_all');
    return result;
  }

  async startClass(id: string) {
    const result = await this.request(`/classes/${id}/start`, {
      method: 'POST',
    });
    // Invalidate specific class cache
    cache.delete(`class_${id}`);
    cache.delete('classes_all');
    return result;
  }

  async joinClass(id: string) {
    return this.request(`/classes/${id}/join`, {
      method: 'POST',
    });
  }

  // Health check with retry logic
  async healthCheck(retries = 3): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.request('/health');
        return true;
      } catch (error) {
        if (i === retries - 1) return false;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return false;
  }
}


  // Classes methods
  async getClasses() {
    return this.request('/classes');
  }

  async getClassById(id: string) {
    return this.request(`/classes/${id}`);
  }

  async createClass(classData: any) {
    return this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async startClass(id: string) {
    return this.request(`/classes/${id}/start`, {
      method: 'POST',
    });
  }

  async joinClass(id: string) {
    return this.request(`/classes/${id}/join`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;