<template>
  <div class="ingredients-container">
    <div class="ingredients-list">
      <div
        v-for="(ingredient, index) in ingredients"
        :key="index"
        class="ingredient-item"
      >
        <template v-if="editable">
          <el-input
            :model-value="
              typeof ingredient === 'object'
                ? ingredient.ingredientName
                : ingredient
            "
            placeholder="Ingredient name"
            style="flex: 2"
            @update:model-value="updateIngredient(index, 'name', $event)"
          />
          <el-input
            :model-value="
              typeof ingredient === 'object' ? ingredient.amount : ''
            "
            placeholder="Amount"
            style="flex: 1"
            @update:model-value="updateIngredient(index, 'amount', $event)"
          />
          <el-button
            type="danger"
            circle
            :disabled="ingredients.length <= 1"
            @click="$emit('removeIngredient', index)"
          >
            <span class="icon-container"><Delete class="button-icon" /></span>
          </el-button>
        </template>
        <template v-else>
          <div v-if="typeof ingredient === 'object'" class="ingredient-display">
            <strong>{{ ingredient.amount }}</strong>
            {{ ingredient.ingredientName }}
          </div>
          <div v-else class="ingredient-display">
            {{ ingredient }}
          </div>
        </template>
      </div>

      <div v-if="!ingredients.length && !editable" class="no-ingredients">
        No ingredients listed
      </div>

      <el-button
        v-if="editable"
        type="primary"
        class="custom-button"
        style="margin-top: 1rem; width: 100%"
        @click="$emit('addIngredient')"
      >
        <span class="icon-container"><Plus class="plus-button-icon" /></span>
        Add Ingredient
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue';
import type { Ingredient } from '@/types/recipe';

const props = defineProps<{
  ingredients: Ingredient[];
  editable?: boolean;
}>();

const emit = defineEmits<{
  updateIngredient: [index: number, field: string, value: string];
  addIngredient: [];
  removeIngredient: [index: number];
}>();

const updateIngredient = (
  index: number,
  field: 'name' | 'amount',
  value: string
) => {
  // Map 'name' to 'ingredientName' for the API
  const apiField = field === 'name' ? 'ingredientName' : field;
  emit('updateIngredient', index, apiField, value);
};
</script>

<style scoped lang="scss">
.ingredients-container {
  width: 100%;
}

.ingredients-list {
  background: var(--light-color);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid var(--accent-color);
  width: 100%;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid var(--primary-color);
}

.ingredient-display {
  flex: 1;
  padding: 0.5rem;
}

.no-ingredients {
  color: var(--primary-color);
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-icon {
  width: 16px;
  height: 16px;
}

.plus-button-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

@media (max-width: 768px) {
  .ingredient-item {
    flex-direction: column;
    gap: 0.5rem;

    .el-input {
      width: 100% !important;
    }
  }
}
</style>
