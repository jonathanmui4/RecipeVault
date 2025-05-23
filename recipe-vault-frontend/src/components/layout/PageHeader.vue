<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-content">
      <router-link to="/" class="logo-link">
        <h1>🍳 Recipe Vault</h1>
      </router-link>

      <div class="header-actions">
        <el-dropdown trigger="hover" placement="bottom-end">
          <el-avatar
            class="user-avatar"
            :size="40"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
            alt="User Avatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <User class="dropdown-icon" />
                Profile
              </el-dropdown-item>
              <el-dropdown-item divided>
                <SwitchButton class="dropdown-icon" />
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { User, SwitchButton } from '@element-plus/icons-vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
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
    margin: 0; // Remove default margin for better link styling
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

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
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

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: row; // Keep horizontal layout on mobile
    gap: 1rem;
  }

  .logo-link h1 {
    font-size: 1.5rem; // Smaller title on mobile
  }

  .user-avatar {
    // Slightly smaller avatar on mobile
    width: 35px !important;
    height: 35px !important;
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
}
</style>
