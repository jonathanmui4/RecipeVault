<template>
  <div class="home-page">
    <div class="page-header">
      <h2>My Recipe Collection</h2>
      <p>Discover, create, and manage your favorite recipes</p>
    </div>

    <SearchAndFilters
      v-model:search="uiStore.searchQuery"
      v-model:difficulty="uiStore.difficultyFilter"
      v-model:ingredient-count="uiStore.ingredientCountFilter"
      @create-recipe="$router.push('/create')"
    />

    <RecipeStats :recipes="uiStore.filteredRecipes" />

    <RecipeTable
      :recipes="uiStore.paginatedRecipes"
      :loading="uiStore.isLoading"
      :current-page="uiStore.currentPage"
      :page-size="uiStore.pageSize"
      :total="uiStore.filteredRecipes.length"
      @update:current-page="uiStore.currentPage = $event"
      @update:page-size="uiStore.pageSize = $event"
      @row-click="handleRowClick"
      @edit-recipe="editRecipe"
      @delete-recipe="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRecipeStore } from '@/stores/recipe';
import { useUIStore } from '@/stores/ui';
import SearchAndFilters from '@/components/recipe/SearchAndFilters.vue';
import RecipeTable from '@/components/recipe/RecipeTable.vue';
import RecipeStats from '@/components/recipe/RecipeStats.vue';
import type { Recipe } from '@/types/recipe';

const recipeStore = useRecipeStore();
const uiStore = useUIStore();
const router = useRouter();

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
