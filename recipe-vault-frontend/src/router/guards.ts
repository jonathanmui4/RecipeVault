import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

export const setupRouteGuards = (router: any) => {
  router.beforeEach(
    (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const authStore = useAuthStore();
      const isAuthenticated = authStore.isAuthenticated;
      const requiresAuth = to.matched.some(
        (record) => record.meta.requiresAuth
      );
      const requiresGuest = to.matched.some(
        (record) => record.meta.requiresGuest
      );

      // Routes that require authentication
      if (requiresAuth && !isAuthenticated) {
        ElMessage.warning('Please log in to access this page');
        next({
          name: 'login',
          query: { redirect: to.fullPath }, // Save intended destination
        });
        return;
      }

      // Routes that require being a guest (login/register)
      if (requiresGuest && isAuthenticated) {
        ElMessage.info('You are already logged in');
        next({ name: 'home' }); // Redirect to home if already authenticated
        return;
      }

      next(); // Allow navigation
    }
  );
};
