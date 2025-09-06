import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { User, Assignment, LiveClass, Course, ApiResponse } from '@shared/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          this.clearToken();
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  private clearToken(): void {
    localStorage.removeItem('auth-token');
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.request({
        method,
        url: endpoint,
        data,
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'API request failed');
      }
      
      return response.data.data as T;
    } catch (error: any) {
      console.error(`API ${method} ${endpoint} failed:`, error);
      throw new Error(error.response?.data?.error || error.message || 'Network error');
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: User; accessToken: string }>('POST', '/auth/login', credentials);
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) {
    return this.request<{ user: User; accessToken: string }>('POST', '/auth/register', userData);
  }

  async getProfile() {
    return this.request<User>('GET', '/auth/me');
  }

  // User endpoints
  async getUsers() {
    return this.request<User[]>('GET', '/users');
  }

  async getStudents() {
    return this.request<User[]>('GET', '/users/students');
  }

  async getUserStats(userId: string) {
    return this.request<any>('GET', `/users/${userId}/stats`);
  }

  // Assignment endpoints
  async getAssignments() {
    return this.request<Assignment[]>('GET', '/assignments');
  }

  async getAssignmentById(id: string) {
    return this.request<Assignment>('GET', `/assignments/${id}`);
  }

  async createAssignment(assignmentData: Partial<Assignment>) {
    return this.request<Assignment>('POST', '/assignments', assignmentData);
  }

  async submitSolution(data: { assignmentId: string; code: string }) {
    return this.request<any>('POST', '/assignments/submit', data);
  }

  // Class endpoints
  async getClasses() {
    return this.request<LiveClass[]>('GET', '/classes');
  }

  async createClass(classData: Partial<LiveClass>) {
    return this.request<LiveClass>('POST', '/classes', classData);
  }

  async joinClass(classId: string) {
    return this.request<any>('POST', `/classes/${classId}/join`);
  }

  // Course endpoints
  async getCourses() {
    return this.request<Course[]>('GET', '/courses');
  }

  async createCourse(courseData: Partial<Course>) {
    return this.request<Course>('POST', '/courses', courseData);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('GET', '/health');
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Export individual API modules for better organization
export const authAPI = {
  login: apiClient.login.bind(apiClient),
  register: apiClient.register.bind(apiClient),
  getProfile: apiClient.getProfile.bind(apiClient),
};

export const userAPI = {
  getUsers: apiClient.getUsers.bind(apiClient),
  getStudents: apiClient.getStudents.bind(apiClient),
  getUserStats: apiClient.getUserStats.bind(apiClient),
};

export const assignmentAPI = {
  getAssignments: apiClient.getAssignments.bind(apiClient),
  getAssignmentById: apiClient.getAssignmentById.bind(apiClient),
  createAssignment: apiClient.createAssignment.bind(apiClient),
  submitSolution: apiClient.submitSolution.bind(apiClient),
};

export const classAPI = {
  getClasses: apiClient.getClasses.bind(apiClient),
  createClass: apiClient.createClass.bind(apiClient),
  joinClass: apiClient.joinClass.bind(apiClient),
};

export const courseAPI = {
  getCourses: apiClient.getCourses.bind(apiClient),
  createCourse: apiClient.createCourse.bind(apiClient),
};

export default apiClient;