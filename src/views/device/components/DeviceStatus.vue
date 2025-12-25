<template>
  <div class="device-status">
    <div class="device-status__name">{{ device.name }}</div>
    <div class="device-status__meta">{{ t('device.deviceId', { id: device.id }) }}</div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

defineProps<{
  device: { id: string; name: string }
}>()

const { t } = useI18n()
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
