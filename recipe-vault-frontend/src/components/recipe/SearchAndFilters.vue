<template>
  <div class="search-filters">
    <div class="controls-row">
      <div class="search-section">
        <el-input
          :model-value="search"
          placeholder="Search recipes by title..."
          style="max-width: 350px"
          clearable
          size="large"
          @update:model-value="$emit('update:search', $event)"
        >
          <template #prefix>
            <span class="icon-container"><Search class="button-icon" /></span>
          </template>
        </el-input>
      </div>

      <div class="filters-section">
        <el-select
          :model-value="difficulty"
          placeholder="Filter by difficulty"
          clearable
          style="width: 180px"
          size="large"
          @update:model-value="$emit('update:difficulty', $event)"
        >
          <el-option label="Easy" value="EASY" />
          <el-option label="Medium" value="MEDIUM" />
          <el-option label="Hard" value="HARD" />
        </el-select>

        <el-select
          :model-value="ingredientCount"
          placeholder="Ingredient count"
          clearable
          style="width: 180px"
          size="large"
          @update:model-value="$emit('update:ingredientCount', $event)"
        >
          <el-option label="1-5 ingredients" value="1-5" />
          <el-option label="6-10 ingredients" value="6-10" />
          <el-option label="11+ ingredients" value="11+" />
        </el-select>

        <el-button
          v-if="authStore.isAuthenticated"
          type="primary"
          class="custom-button"
          size="large"
          @click="$emit('createRecipe')"
        >
          <span class="icon-container"><Plus class="button-icon" /></span>
          Create Recipe
        </el-button>

        <el-button
          v-else
          type="primary"
          class="custom-button"
          size="large"
          @click="$router.push('/login')"
        >
          <span class="icon-container"><Lock class="button-icon" /></span>
          Login to Create
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Plus, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

defineProps<{
  search: string;
  difficulty: string;
  ingredientCount: string;
}>();

defineEmits<{
  'update:search': [value: string];
  'update:difficulty': [value: string];
  'update:ingredientCount': [value: string];
  createRecipe: [];
}>();
</script>

<style scoped lang="scss">
.search-filters {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
}

.controls-row {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
}

.filters-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-section {
    width: 100%;

    .el-input {
      max-width: none !important;
    }
  }

  .filters-section {
    flex-direction: column;
    width: 100%;

    .el-select,
    .el-button {
      width: 100%;
    }
  }
}
</style>
