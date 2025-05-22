<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo-link">
        <h1>🍳 Recipe Vault</h1>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--accent-color) 100%
  );
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

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
}
</style>
