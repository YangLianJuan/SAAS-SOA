<template>
  <div class="saas-card" :class="variantClass">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'compact' | 'highlight'
}>()

const variantClass = computed(() => (props.variant ? `saas-card--${props.variant}` : ''))
</script>

