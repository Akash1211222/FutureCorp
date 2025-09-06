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
          window.location.href = '/login';
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
  async getUsers() {
    return this.request('/users');
  }

  async getStudents() {
    return this.request('/users/students');
  }

  async getUserStats(userId: string) {
    return this.request(`/users/${userId}/stats`);
  }

  // Assignments methods
  async getAssignments() {
    return this.request('/assignments');
  }

  async getAssignmentById(id: string) {
    return this.request(`/assignments/${id}`);
  }

  async createAssignment(assignmentData: any) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async submitSolution(data: { assignmentId: string; code: string }) {
    return this.request('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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