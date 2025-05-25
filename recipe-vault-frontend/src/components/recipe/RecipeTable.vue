<template>
  <div class="recipe-table-container">
    <el-table
      v-loading="loading"
      :data="recipes"
      style="width: 100%"
      row-style="cursor: pointer;"
      empty-text="No recipes found. Create your first recipe!"
      @row-click="$emit('rowClick', $event)"
    >
      <el-table-column prop="title" label="Recipe Title" min-width="200">
        <template #default="scope">
          <div class="recipe-title">
            <strong>{{ scope.row.title }}</strong>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="difficulty_level" label="Difficulty" width="120">
        <template #default="scope">
          <DifficultyBadge :difficulty="scope.row.difficulty" />
        </template>
      </el-table-column>

      <el-table-column
        prop="ingredientCount"
        label="Ingredients"
        width="120"
        align="center"
      >
        <template #default="scope">
          <el-tag type="info" size="small">
            {{ scope.row.ingredientCount }} items
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="creatorName" label="Creator" width="150" />

      <el-table-column prop="createdDate" label="Created" width="150">
        <template #default="scope">
          {{ formatDate(scope.row.createdDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="scope">
          <div class="table-actions">
            <!-- Show edit/delete only for user's recipes -->
            <template v-if="canModifyRecipe(scope.row)">
              <el-button
                size="small"
                type="primary"
                class="custom-button"
                @click.stop="$emit('editRecipe', scope.row)"
              >
                <span class="icon-container"><Edit class="button-icon" /></span>
                Edit
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="$emit('deleteRecipe', scope.row)"
              >
                <span class="icon-container"
                  ><Delete class="button-icon"
                /></span>
                Delete
              </el-button>
              <el-button
                size="small"
                type="primary"
                class="custom-button"
                @click.stop="$emit('editRecipe', scope.row)"
              >
                <span class="icon-container"><Edit class="button-icon" /></span>
                Edit
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="$emit('deleteRecipe', scope.row)"
              >
                <span class="icon-container"
                  ><Delete class="button-icon"
                /></span>
                Delete
              </el-button>
            </template>

            <!-- Show view button for other recipes -->
            <template v-else>
              <el-button
                size="small"
                type="info"
                class="custom-button-secondary"
                @click.stop="$emit('rowClick', scope.row)"
              >
                <span class="icon-container"><View class="button-icon" /></span>
                View
              </el-button>
              <span class="recipe-owner">{{ getOwnerText(scope.row) }}</span>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @update:current-page="$emit('update:currentPage', $event)"
      @update:page-size="$emit('update:pageSize', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete, View } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { canUserModifyRecipe, getRecipeOwnerText } from '@/utils/recipeUtils';
import DifficultyBadge from '@/components/ui/DifficultyBadge.vue';
import type { Recipe } from '@/types/recipe';

const authStore = useAuthStore();

defineProps<{
  recipes: Recipe[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
}>();

defineEmits<{
  rowClick: [recipe: Recipe];
  editRecipe: [recipe: Recipe];
  deleteRecipe: [recipe: Recipe];
  'update:currentPage': [page: number];
  'update:pageSize': [size: number];
}>();

// Check if current user can modify this recipe
const canModifyRecipe = (recipe: Recipe): boolean => {
  return canUserModifyRecipe(recipe, authStore.user);
};

const getOwnerText = (recipe: Recipe): string => {
  return getRecipeOwnerText(recipe, authStore.user);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped lang="scss">
.recipe-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent-color);
}

.recipe-title {
  font-weight: 600;
  color: var(--dark-color);
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.recipe-owner {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-style: italic;
  margin-left: 0.5rem;
}

.el-pagination {
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
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
  .table-actions {
    flex-direction: column;
    gap: 0.25rem;
  }

  .recipe-owner {
    margin-left: 0;
    margin-top: 0.25rem;
  }
}
</style>
