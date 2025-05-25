<template>
  <div class="home-page">
    <div class="page-header">
      <h2>{{ pageTitle }}</h2>
      <p>{{ pageSubtitle }}</p>
    </div>

    <SearchAndFilters
      v-model:search="uiStore.searchQuery"
      v-model:difficulty="uiStore.difficultyFilter"
      v-model:ingredient-count="uiStore.ingredientCountFilter"
      @create-recipe="handleCreateRecipe"
    />

    <RecipeStats :recipes="displayedRecipes" />

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

    <!-- Empty State for My Recipes -->
    <div
      v-if="
        activeTab === 'my-recipes' &&
        myRecipes.length === 0 &&
        !uiStore.isLoading
      "
      class="empty-state"
    >
      <div class="empty-content">
        <Document class="empty-icon" />
        <h3>No recipes yet</h3>
        <p>
          You haven't created any recipes yet. Start by creating your first
          recipe!
        </p>
        <el-button
          type="primary"
          class="custom-button"
          size="large"
          @click="handleCreateRecipe"
        >
          <Plus class="button-icon" />
          Create Your First Recipe
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Plus, Document } from '@element-plus/icons-vue';
import { useRecipeStore } from '@/stores/recipe';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { canUserModifyRecipe } from '@/utils/recipeUtils';
import SearchAndFilters from '@/components/recipe/SearchAndFilters.vue';
import RecipeTable from '@/components/recipe/RecipeTable.vue';
import RecipeStats from '@/components/recipe/RecipeStats.vue';
import type { Recipe } from '@/types/recipe';

const recipeStore = useRecipeStore();
const uiStore = useUIStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const activeTab = ref('all');
const myRecipes = ref<Recipe[]>([]);

// Computed properties
const pageTitle = computed(() => {
  if (activeTab.value === 'my-recipes') {
    return 'My Recipe Collection';
  }
  return 'Recipe Collection';
});

const pageSubtitle = computed(() => {
  if (activeTab.value === 'my-recipes') {
    return 'Manage and edit your personal recipes';
  }
  return 'Discover, create, and manage your favorite recipes';
});

const displayedRecipes = computed(() => {
  if (activeTab.value === 'my-recipes') {
    return myRecipes.value;
  }
  return uiStore.filteredRecipes;
});

// Handle query parameter for direct linking to "My Recipes"
const initializeTab = () => {
  if (route.query.filter === 'my-recipes' && authStore.isAuthenticated) {
    activeTab.value = 'my-recipes';
  }
};

// Load user's recipes
const loadMyRecipes = async () => {
  if (!authStore.isAuthenticated) {
    return;
  }

  try {
    uiStore.setLoading(true);
    const userRecipes = await recipeStore.fetchMyRecipes();
    myRecipes.value = userRecipes || [];
  } catch (error) {
    console.error('Error loading user recipes:', error);
    ElMessage.error('Failed to load your recipes');
  } finally {
    uiStore.setLoading(false);
  }
};

// Handle tab changes
const handleTabChange = (tabName: string) => {
  activeTab.value = tabName;

  // Update URL without navigation
  const query = tabName === 'my-recipes' ? { filter: 'my-recipes' } : {};
  router.replace({ query });

  // Load appropriate data
  if (tabName === 'my-recipes') {
    loadMyRecipes();
    // Update UI store to filter my recipes
    uiStore.recipes = myRecipes.value;
  } else {
    // Load all recipes
    recipeStore.fetchRecipes();
  }

  // Reset pagination
  uiStore.currentPage = 1;
};

const handleRowClick = (row: Recipe) => {
  router.push(`/recipe/${row.id}`);
};

const handleCreateRecipe = () => {
  if (authStore.isAuthenticated) {
    router.push('/create');
  } else {
    router.push('/login');
  }
};

const editRecipe = (recipe: Recipe) => {
  // Check ownership before allowing edit
  if (
    authStore.isAuthenticated &&
    canUserModifyRecipe(recipe, authStore.user)
  ) {
    router.push(`/edit/${recipe.id}`);
  } else {
    ElMessage.warning('You can only edit your own recipes');
  }
};

const confirmDelete = async (recipe: Recipe) => {
  // Check ownership before allowing delete
  if (
    !authStore.isAuthenticated ||
    !canUserModifyRecipe(recipe, authStore.user)
  ) {
    ElMessage.warning('You can only delete your own recipes');
    return;
  }

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

      // Refresh the appropriate list
      if (activeTab.value === 'my-recipes') {
        loadMyRecipes();
      } else {
        recipeStore.fetchRecipes();
      }
    } else {
      ElMessage.error('Failed to delete recipe');
    }
  } catch {
    // User cancelled
  }
};

// Watch for authentication changes
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (!isAuth && activeTab.value === 'my-recipes') {
      activeTab.value = 'all';
      router.replace({ query: {} });
    }
  }
);

onMounted(() => {
  initializeTab();

  // Load initial data based on tab
  if (activeTab.value === 'my-recipes') {
    loadMyRecipes();
  } else {
    recipeStore.fetchRecipes();
  }
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

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.empty-content h3 {
  color: var(--dark-color);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-content p {
  color: var(--primary-color);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

// Element Plus tab customizations
:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--accent-color);
}

:deep(.el-tabs__item) {
  color: var(--primary-color);
  font-weight: 500;

  &.is-active {
    color: var(--dark-color);
  }

  &:hover {
    color: var(--accent-color);
  }
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
}

@media (max-width: 768px) {
  .page-header h2 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .filter-tabs {
    padding: 0.5rem 1rem 0;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
}
</style>
