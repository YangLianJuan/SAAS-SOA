<template>
  <div class="saas-empty">
    <div class="saas-empty__title">{{ title }}</div>
    <div v-if="description" class="saas-empty__desc">{{ description }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  { title: '暂无数据' },
)
</script>

<style scoped lang="less">
.saas-empty {
  padding: @spacing-lg;
  border: 1px dashed @color-border;
  border-radius: @radius-card;
  color: @color-text-secondary;
}

.saas-empty__title {
  color: @color-text-primary;
  font-weight: 600;
  margin-bottom: 4px;
}

.saas-empty__desc {
  margin-bottom: 8px;
}
</style>

