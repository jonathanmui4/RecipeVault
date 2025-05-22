<template>
  <div class="home-page">
    <div class="page-header">
      <h2>My Recipe Collection</h2>
      <p>Discover, create, and manage your favorite recipes</p>
    </div>

    <SearchAndFilters
      v-model:search="searchQuery"
      v-model:difficulty="difficultyFilter"
      v-model:ingredient-count="ingredientCountFilter"
      @create-recipe="$router.push('/create')"
    />

    <RecipeStats :recipes="filteredRecipes" />

    <RecipeTable
      :recipes="paginatedRecipes"
      :loading="recipeStore.loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredRecipes.length"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @row-click="handleRowClick"
      @edit-recipe="editRecipe"
      @delete-recipe="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRecipeStore } from '@/stores/recipe';
import SearchAndFilters from '@/components/recipe/SearchAndFilters.vue';
import RecipeTable from '@/components/recipe/RecipeTable.vue';
import RecipeStats from '@/components/recipe/RecipeStats.vue';
import type { Recipe } from '@/types/recipe';

const recipeStore = useRecipeStore();
const router = useRouter();

const searchQuery = ref('');
const difficultyFilter = ref('');
const ingredientCountFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const filteredRecipes = computed(() => {
  let filtered = recipeStore.recipes;

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Difficulty filter
  if (difficultyFilter.value) {
    filtered = filtered.filter(
      (recipe) => recipe.difficulty === difficultyFilter.value.toUpperCase()
    );
  }

  // Ingredient count filter
  if (ingredientCountFilter.value) {
    console.log('Filtering by ingredient count:', ingredientCountFilter.value);
    filtered = filtered.filter((recipe) => {
      console.log(recipe);
      const count = recipe.ingredientCount || 0;
      if (ingredientCountFilter.value === '1-5') {
        return count >= 1 && count <= 5;
      }
      if (ingredientCountFilter.value === '6-10') {
        return count >= 6 && count <= 10;
      }
      if (ingredientCountFilter.value === '11+') {
        return count >= 11;
      }
      return true;
    });
  }

  return filtered;
});

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRecipes.value.slice(start, end);
});

const handleRowClick = (row: Recipe) => {
  router.push(`/recipe/${row.id}`);
};

const editRecipe = (recipe: Recipe) => {
  router.push(`/edit/${recipe.id}`);
};

const confirmDelete = async (recipe: Recipe) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${recipe.title}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    const success = await recipeStore.deleteRecipe(recipe.id!);
    if (success) {
      ElMessage.success('Recipe deleted successfully!');
    } else {
      ElMessage.error('Failed to delete recipe');
    }
  } catch {
    // User cancelled
  }
};

onMounted(() => {
  recipeStore.fetchRecipes();
});
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 1rem;

  h2 {
    color: var(--dark-color);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--primary-color);
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .page-header h2 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }
}
</style>
