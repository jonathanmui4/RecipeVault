<template>
  <div class="recipe-stats">
    <div class="stat-card">
      <div class="stat-number">{{ recipes.length }}</div>
      <div class="stat-label">Total Recipes</div>
    </div>

    <div class="stat-card">
      <div class="stat-number">{{ easyRecipes }}</div>
      <div class="stat-label">Easy Recipes</div>
    </div>

    <div class="stat-card">
      <div class="stat-number">{{ mediumRecipes }}</div>
      <div class="stat-label">Medium Recipes</div>
    </div>

    <div class="stat-card">
      <div class="stat-number">{{ hardRecipes }}</div>
      <div class="stat-label">Hard Recipes</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Recipe } from '@/types/recipe';

const props = defineProps<{
  recipes: Recipe[];
}>();

const easyRecipes = computed(
  () => props.recipes.filter((r) => r.difficulty === 'EASY').length
);

const mediumRecipes = computed(
  () => props.recipes.filter((r) => r.difficulty === 'MEDIUM').length
);

const hardRecipes = computed(
  () => props.recipes.filter((r) => r.difficulty === 'HARD').length
);
</script>

<style scoped lang="scss">
.recipe-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--dark-color);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .recipe-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
