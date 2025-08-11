const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

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
    role: 'teacher' | 'student';
  }): Promise<AuthResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Assignment methods
  async createAssignment(assignmentData: any) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async getAssignments() {
    return this.request('/assignments');
  }

  // Live class methods
  async createLiveClass(classData: any) {
    return this.request('/live-classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async getLiveClasses() {
    return this.request('/live-classes');
  }

  async startLiveClass(classId: string) {
    return this.request(`/live-classes/${classId}/start`, {
      method: 'POST',
    });
  }

  async joinLiveClass(classId: string) {
    return this.request(`/live-classes/${classId}/join`, {
      method: 'POST',
    });
  }

  // User methods
  async getUsers() {
    return this.request('/users');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;