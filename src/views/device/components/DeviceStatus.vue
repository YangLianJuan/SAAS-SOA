<template>
  <div class="device-status">
    <div class="device-status__name">{{ device.name }}</div>
    <div class="device-status__meta">ID: {{ device.id }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  device: { id: string; name: string }
}>()
</script>

<style scoped lang="less">
.device-status__name {
  font-weight: 600;
}

.device-status__meta {
  margin-top: 6px;
  font-size: 12px;
  color: @color-text-secondary;
}
</style>

