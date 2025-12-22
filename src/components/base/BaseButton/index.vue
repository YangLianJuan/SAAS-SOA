<template>
  <button class="saas-btn" :class="sizeClass" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    size: 'md',
    disabled: false,
  },
)

const sizeClass = computed(() => `saas-btn--${props.size}`)
</script>

<style scoped lang="less">
.saas-btn {
  border: 1px solid @color-border;
  background: @color-bg-card;
  color: @color-text-primary;
  border-radius: @radius-sm;
  cursor: pointer;
}

.saas-btn--sm {
  padding: 6px 10px;
  font-size: 12px;
}

.saas-btn--md {
  padding: 8px 12px;
  font-size: 14px;
}

.saas-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

