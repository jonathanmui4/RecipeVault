import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { setupRouteGuards } from './guards';
import Home from '@/views/Home.vue';
import RecipeDetail from '@/views/RecipeDetail.vue';
import RecipeForm from '@/views/RecipeForm.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true,
      title: 'Login - Recipe Vault',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresGuest: true,
      title: 'Register - Recipe Vault',
    },
  },
  {
    path: '/create',
    name: 'CreateRecipe',
    component: RecipeForm,
    meta: {
      requiresAuth: true,
      title: 'Create Recipe - Recipe Vault',
    },
  },
  {
    path: '/edit/:id',
    name: 'EditRecipe',
    component: RecipeForm,
    meta: {
      requiresAuth: true,
      title: 'Edit Recipe - Recipe Vault',
    },
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    meta: {
      title: 'Recipe Details - Recipe Vault',
    },
  },
  // Catch-all route for 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Setup route guards
setupRouteGuards(router);

// Update page title based on route meta
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Recipe Vault';
});

export default router;
