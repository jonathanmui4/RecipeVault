import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { LoginCredentials, RegisterData, User } from '@/types/auth';
import { authService } from '@/services/authService';
import { ApiError } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticating = ref(false); // More specific name

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const userDisplayName = computed(() => {
    if (!user.value) {
      return '';
    }
    return (
      `${user.value.firstName} ${user.value.lastName}`.trim() ||
      user.value.username
    );
  });
  const userInitials = computed(() => {
    if (!user.value) {
      return '';
    }
    const first = user.value.firstName?.charAt(0) || '';
    const last = user.value.lastName?.charAt(0) || '';
    return (
      (first + last).toUpperCase() ||
      user.value.username.charAt(0).toUpperCase()
    );
  });

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isAuthenticating.value = true;
    try {
      const response = await authService.login(credentials);

      user.value = response.user;
      token.value = response.token;
      authService.saveAuthData(response.token, response.user);

      ElMessage.success(`Welcome back, ${response.user.firstName}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ApiError) {
        ElMessage.error(error.message);
      } else {
        ElMessage.error('Login failed. Please try again.');
      }
      return false;
    } finally {
      isAuthenticating.value = false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    isAuthenticating.value = true;
    try {
      await authService.register(userData);
      ElMessage.success('Registration successful! Please log in.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ApiError) {
        ElMessage.error(error.message);
      } else {
        ElMessage.error('Registration failed. Please try again.');
      }
      return false;
    } finally {
      isAuthenticating.value = false;
    }
  };

  const logout = (): void => {
    user.value = null;
    token.value = null;
    authService.clearAuthData();
    ElMessage.success('Logged out successfully');
  };

  const initializeAuth = async (): Promise<void> => {
    try {
      const storedAuth = authService.getStoredAuthData();

      if (storedAuth.token && storedAuth.user) {
        token.value = storedAuth.token;
        user.value = storedAuth.user;
        authService.setAuthToken(storedAuth.token);
        console.log('Authentication restored from cookies');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      authService.clearAuthData();
    }
  };

  // Keep only these simple helpers for the components
  const checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    try {
      const exists = await authService.checkUsernameAvailability(username);
      return !exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const exists = await authService.checkEmailAvailability(email);
      return !exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  return {
    // State
    user,
    token,
    isAuthenticating, // Renamed for clarity

    // Computed
    isAuthenticated,
    userDisplayName,
    userInitials,

    // Actions
    login,
    register,
    logout,
    initializeAuth,

    // Simple helpers
    checkUsernameAvailability,
    checkEmailAvailability,
  };
});
