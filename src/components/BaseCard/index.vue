<template>
  <a-card class="saas-card" :class="variantClass" v-bind="cardAttrs" :bordered="bordered">
    <template v-if="$slots.header" #title>
      <slot name="header" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>

    <slot />

    <div v-if="$slots.footer" class="saas-card__footer">
      <slot name="footer" />
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'compact' | 'hover' | 'highlight'
    bordered?: boolean
  }>(),
  { variant: 'default', bordered: false },
)

const attrs = useAttrs()
const cardAttrs = computed(() => attrs)

const variantClass = computed(() => (props.variant ? `saas-card--${props.variant}` : ''))
</script>

<style scoped lang="less">
.saas-card {
  background: @color-bg-card;
  border-radius: @radius-card;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.saas-card :deep(.ant-card-body) {
  padding: @spacing-md;
}

.saas-card__footer {
  margin-top: @spacing-md;
  padding-top: @spacing-md;
  border-top: 1px solid @color-border;
}

.saas-card--compact {
  box-shadow: none;
}

.saas-card--compact :deep(.ant-card-body) {
  padding: @spacing-md;
}

.saas-card--hover {
  transition: box-shadow 150ms ease;
}

.saas-card--hover:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.saas-card--highlight {
  border: 1px solid @color-primary;
}
</style>
