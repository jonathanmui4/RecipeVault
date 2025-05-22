<template>
  <span :class="difficultyClass" class="difficulty-badge">
    {{ difficulty }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}>();

const difficultyClass = computed(() => {
  switch (props.difficulty?.toUpperCase()) {
    case 'EASY':
      return 'difficulty-easy';
    case 'MEDIUM':
      return 'difficulty-medium';
    case 'HARD':
      return 'difficulty-hard';
    default:
      return 'difficulty-hard';
  }
});
</script>

<style scoped lang="scss">
.difficulty-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.difficulty-easy {
  background-color: #67c23a;
  color: white;
}

.difficulty-medium {
  background-color: #e6a23c;
  color: white;
}

.difficulty-hard {
  background-color: #f56c6c;
  color: white;
}
</style>
