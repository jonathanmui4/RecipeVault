<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Recipe Vault account</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="auth-form"
          size="large"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="usernameOrEmail">
            <el-input
              v-model="loginForm.usernameOrEmail"
              placeholder="Username or Email"
              prefix-icon="User"
              :disabled="authStore.isAuthenticating"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Password"
              prefix-icon="Lock"
              show-password
              :disabled="authStore.isAuthenticating"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <div class="form-options">
              <el-checkbox
                v-model="loginForm.rememberMe"
                :disabled="authStore.isAuthenticating"
              >
                Remember me
              </el-checkbox>
              <div class="forgot-link">Forgot password?</div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="custom-button auth-submit-btn"
              :loading="authStore.isAuthenticating"
              @click="handleLogin"
            >
              <span v-if="!authStore.isAuthenticating" class="icon-container">
                <Lock class="button-icon" />
              </span>
              {{ authStore.isAuthenticating ? 'Signing In...' : 'Sign In' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <router-link to="/register" class="auth-link"
              >Sign up here</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import type { LoginCredentials } from '@/types/auth';

const authStore = useAuthStore();
const router = useRouter();
const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
  usernameOrEmail: '',
  password: '',
  rememberMe: false,
});

const loginRules: FormRules = {
  usernameOrEmail: [
    {
      required: true,
      message: 'Username or email is required',
      trigger: 'blur',
    },
    { min: 3, message: 'Must be at least 3 characters', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    {
      min: 8,
      message: 'Password must be at least 8 characters',
      trigger: 'blur',
    },
  ],
};

const handleLogin = async () => {
  if (!loginFormRef.value) {
    return;
  }

  try {
    await loginFormRef.value.validate();

    const credentials: LoginCredentials = {
      usernameOrEmail: loginForm.usernameOrEmail.trim(),
      password: loginForm.password,
    };

    const success = await authStore.login(credentials);

    if (success) {
      // Redirect to home or intended route
      const redirectTo =
        (router.currentRoute.value.query.redirect as string) || '/';
      router.push(redirectTo);
    }
  } catch (error) {
    console.error('Login validation failed:', error);
  }
};
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-color) 0%, #f5e6d3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 2px solid var(--accent-color);
  overflow: hidden;
}

.auth-header {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--accent-color) 100%
  );
  color: white;
  padding: 2rem;
  text-align: center;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  p {
    opacity: 0.9;
    font-size: 1rem;
  }
}

.auth-form {
  padding: 2rem;

  .el-form-item {
    margin-bottom: 1.5rem;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-color);
  }
}

.auth-submit-btn {
  width: 100%;
  height: 48px;
  font-size: 1.1rem;
  font-weight: 600;
}

.auth-footer {
  background: var(--light-color);
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid #eee;

  p {
    margin: 0;
    color: var(--dark-color);
  }
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-color);
  }
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

// Element Plus customizations
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--accent-color);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    &.is-focus {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
  }
}

:deep(.el-checkbox) {
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-header {
    padding: 1.5rem;

    h1 {
      font-size: 1.5rem;
    }
  }

  .auth-form {
    padding: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
