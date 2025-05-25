import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.VUE_APP_API_BASE_URL || '/api';
    const timeout = parseInt(process.env.VUE_APP_API_TIMEOUT || '10000');

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`
        );
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const message = this.getErrorMessage(error);
        const status = error.response?.status;
        const code = error.code;
        const data = error.response?.data;

        // Handle authentication errors
        if (status === 401) {
          // Token expired or invalid - trigger logout
          import('@/stores/auth').then(({ useAuthStore }) => {
            const authStore = useAuthStore();
            authStore.logout();
          });
        }

        throw new ApiError(message, status, code, data);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      if (data?.message) {
        return data.message;
      }

      switch (status) {
        case 400:
          return 'Bad request - please check your input';
        case 401:
          return 'Unauthorized - please login';
        case 403:
          return 'Forbidden - insufficient permissions';
        case 404:
          return 'Resource not found';
        case 422:
          return 'Validation error - please check your input';
        case 500:
          return 'Server error - please try again later';
        default:
          return `Request failed with status ${status}`;
      }
    } else if (error.request) {
      return 'Network error - please check your connection';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }

  // For auth token management
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: any): Promise<T> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: any): Promise<T> {
    const response = await this.client.delete(endpoint, config);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch(endpoint, data);
    return response.data;
  }
}

export const apiService = new ApiService();
