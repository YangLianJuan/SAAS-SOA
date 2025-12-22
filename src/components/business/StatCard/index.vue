<template>
  <BaseCard>
    <div class="stat-card">
      <div class="stat-card__title">{{ title }}</div>
      <div class="stat-card__value">{{ value }}</div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard/index.vue'

defineProps<{
  title: string
  value: string | number
}>()
</script>

<style scoped lang="less">
.stat-card__title {
  color: @color-text-secondary;
  font-size: 12px;
}

.stat-card__value {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 700;
}
</style>

