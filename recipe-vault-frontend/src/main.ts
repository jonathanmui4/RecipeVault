import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './assets/styles/main.scss';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

// Register Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(pinia);
app.use(router);

// Initialize authentication before mounting
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

authStore.initializeAuth().then(() => {
  app.mount('#app');
});
