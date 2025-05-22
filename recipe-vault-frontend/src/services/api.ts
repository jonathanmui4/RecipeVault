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

  // TODO: Replace base URL with environment variable to toggle between dev and prod
  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:9000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth headers, loading states, etc. here in the future
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

        throw new ApiError(message, status, code, data);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      // Server responded with error status
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
      // Network error
      return 'Network error - please check your connection';
    } else {
      // Request setup error
      return error.message || 'An unexpected error occurred';
    }
  }

  // GET requests
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return response.data;
  }

  // POST requests
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  // PUT requests
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  // DELETE requests
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  // PATCH requests
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return response.data;
  }
}

export const apiService = new ApiService();
