<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Join Recipe Vault</h1>
          <p>Create your account and start sharing recipes</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="auth-form"
          size="large"
          @submit.prevent="handleRegister"
        >
          <div class="name-row">
            <el-form-item prop="firstName" class="name-field">
              <el-input
                v-model="registerForm.firstName"
                placeholder="First Name"
                prefix-icon="User"
                :disabled="authStore.isAuthenticating"
              />
            </el-form-item>

            <el-form-item prop="lastName" class="name-field">
              <el-input
                v-model="registerForm.lastName"
                placeholder="Last Name"
                prefix-icon="User"
                :disabled="authStore.isAuthenticating"
              />
            </el-form-item>
          </div>

          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="Username"
              prefix-icon="Avatar"
              :disabled="authStore.isAuthenticating"
              @blur="checkUsernameAvailability"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              type="email"
              placeholder="Email Address"
              prefix-icon="Message"
              :disabled="authStore.isAuthenticating"
              @blur="checkEmailAvailability"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="Password"
              prefix-icon="Lock"
              show-password
              :disabled="authStore.isAuthenticating"
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="Confirm Password"
              prefix-icon="Lock"
              show-password
              :disabled="authStore.isAuthenticating"
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="custom-button auth-submit-btn"
              :loading="authStore.isAuthenticating"
              @click="handleRegister"
            >
              <span v-if="!authStore.isAuthenticating" class="icon-container">
                <UserFilled class="button-icon" />
              </span>
              {{
                authStore.isAuthenticating
                  ? 'Creating Account...'
                  : 'Create Account'
              }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login" class="auth-link"
              >Sign in here</router-link
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
import {
  UserFilled,
  User,
  Avatar,
  Message,
  Lock,
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import type { RegisterData } from '@/types/auth';

const authStore = useAuthStore();
const router = useRouter();
const registerFormRef = ref<FormInstance>();

const registerForm = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// Custom validators
const validateUsername = async (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('Username is required'));
  }
  if (value.length < 3) {
    return callback(new Error('Username must be at least 3 characters'));
  }
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return callback(
      new Error('Username can only contain letters, numbers, and underscores')
    );
  }
  callback();
};

const validateEmail = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('Email is required'));
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return callback(new Error('Please enter a valid email address'));
  }
  callback();
};

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('Password is required'));
  }
  if (value.length < 8) {
    return callback(new Error('Password must be at least 8 characters'));
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    return callback(
      new Error(
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      )
    );
  }
  callback();
};

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('Please confirm your password'));
  }
  if (value !== registerForm.password) {
    return callback(new Error('Passwords do not match'));
  }
  callback();
};

const registerRules: FormRules = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' },
    {
      min: 2,
      message: 'First name must be at least 2 characters',
      trigger: 'blur',
    },
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur' },
    {
      min: 2,
      message: 'Last name must be at least 2 characters',
      trigger: 'blur',
    },
  ],
  username: [{ validator: validateUsername, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
};

const checkUsernameAvailability = async () => {
  if (registerForm.username.length >= 3) {
    const isAvailable = await authStore.checkUsernameAvailability(
      registerForm.username
    );
    if (!isAvailable) {
      ElMessage.warning('Username is already taken');
    }
  }
};

const checkEmailAvailability = async () => {
  if (
    registerForm.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)
  ) {
    const isAvailable = await authStore.checkEmailAvailability(
      registerForm.email
    );
    if (!isAvailable) {
      ElMessage.warning('Email is already registered');
    }
  }
};

const handleRegister = async () => {
  if (!registerFormRef.value) {
    return;
  }

  try {
    await registerFormRef.value.validate();

    const userData: RegisterData = {
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
    };

    const success = await authStore.register(userData);

    if (success) {
      // Redirect to login page
      router.push('/login');
    }
  } catch (error) {
    console.error('Registration validation failed:', error);
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
  max-width: 450px;
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

.name-row {
  display: flex;
  gap: 1rem;

  .name-field {
    flex: 1;
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

  .name-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
