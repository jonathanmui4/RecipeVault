<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-content">
      <router-link to="/" class="logo-link">
        <h1>🍳 Recipe Vault</h1>
      </router-link>

      <div class="header-actions">
        <!-- Authenticated User Menu -->
        <div v-if="authStore.isAuthenticated" class="user-menu">
          <span class="welcome-text"
            >Hello, {{ authStore.userDisplayName }}!</span
          >

          <el-dropdown trigger="hover" placement="bottom-end">
            <div class="user-avatar-container">
              <el-avatar
                class="user-avatar"
                :size="40"
                :src="userAvatarUrl"
                :alt="authStore.userDisplayName"
              >
                {{ authStore.userInitials }}
              </el-avatar>
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToMyRecipes">
                  <Document class="dropdown-icon" />
                  My Recipes
                </el-dropdown-item>
                <el-dropdown-item @click="goToCreateRecipe">
                  <Plus class="dropdown-icon" />
                  Create Recipe
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <User class="dropdown-icon" />
                  Profile Settings
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  <SwitchButton class="dropdown-icon" />
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- Guest User Actions -->
        <div v-else class="guest-actions">
          <el-button
            class="custom-button-secondary header-btn"
            @click="$router.push('/login')"
          >
            <Lock class="button-icon" />
            Sign In
          </el-button>

          <el-button
            type="primary"
            class="custom-button header-btn"
            @click="$router.push('/register')"
          >
            <UserFilled class="button-icon" />
            Sign Up
          </el-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  User,
  SwitchButton,
  Document,
  Plus,
  ArrowDown,
  Lock,
  UserFilled,
} from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const isScrolled = ref(false);

// Generate avatar URL based on user initials or use default
const userAvatarUrl = computed(() => {
  if (!authStore.user) {
    return '';
  }
  // Using DiceBear API for consistent avatars
  return `https://api.dicebear.com/7.x/initials/svg?seed=${authStore.userDisplayName}&backgroundColor=aa947a&textColor=ffffff`;
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

const goToMyRecipes = () => {
  router.push({ name: 'home', query: { filter: 'my-recipes' } });
};

const goToCreateRecipe = () => {
  router.push('/create');
};

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to logout?',
      'Confirm Logout',
      {
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    authStore.logout();
    router.push('/');
  } catch {
    // User cancelled logout
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--accent-color) 100%
  );
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &.header-scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    margin: 0;
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  font-weight: 500;
  font-size: 0.95rem;
  opacity: 0.9;
}

.user-avatar-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  transition: transform 0.3s ease;
}

.guest-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  height: 40px;
  padding: 0 1.2rem;
  font-weight: 500;

  .button-icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

// Element Plus dropdown customizations
:deep(.el-dropdown-menu) {
  border-radius: 8px;
  border: 1px solid var(--accent-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.el-dropdown-menu__item) {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 0.95rem;

  &:hover {
    background-color: var(--light-color);
    color: var(--dark-color);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: row;
    gap: 1rem;
  }

  .logo-link h1 {
    font-size: 1.5rem;
  }

  .welcome-text {
    display: none; // Hide welcome text on mobile
  }

  .user-avatar {
    width: 35px !important;
    height: 35px !important;
  }

  .guest-actions {
    flex-direction: row;
    gap: 0.5rem;
  }

  .header-btn {
    height: 36px;
    padding: 0 1rem;
    font-size: 0.9rem;

    .button-icon {
      width: 12px;
      height: 12px;
    }
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }

  .logo-link h1 {
    font-size: 1.25rem;
  }

  .user-avatar {
    width: 32px !important;
    height: 32px !important;
  }

  .header-btn {
    height: 32px;
    padding: 0 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
