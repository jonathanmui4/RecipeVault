import { apiService } from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/types/auth';

class AuthService {
  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await apiService.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterData): Promise<User> {
    return await apiService.post<User>('/auth/register', userData);
  }

  // Validation endpoints
  async checkUsernameAvailability(username: string): Promise<boolean> {
    return await apiService.get<boolean>(
      `/auth/check-username?username=${encodeURIComponent(username)}`
    );
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    return await apiService.get<boolean>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
  }

  // Token management
  setAuthToken(token: string): void {
    apiService.setAuthToken(token);
  }

  removeAuthToken(): void {
    // Remove token from axios headers
    apiService.removeAuthToken();
  }

  // Cookie management for JWT
  private readonly TOKEN_COOKIE_NAME = 'recipe_vault_token';
  private readonly USER_COOKIE_NAME = 'recipe_vault_user';

  saveAuthData(token: string, user: User): void {
    // Save to cookies with 7 day expiry
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    document.cookie = `${
      this.TOKEN_COOKIE_NAME
    }=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = `${this.USER_COOKIE_NAME}=${JSON.stringify(
      user
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

    this.setAuthToken(token);
  }

  getStoredAuthData(): { token: string | null; user: User | null } {
    const token = this.getCookie(this.TOKEN_COOKIE_NAME);
    const userStr = this.getCookie(this.USER_COOKIE_NAME);

    let user: User | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }

    return { token, user };
  }

  clearAuthData(): void {
    // Remove cookies
    document.cookie = `${this.TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${this.USER_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    this.removeAuthToken();
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  }
}

export const authService = new AuthService();
