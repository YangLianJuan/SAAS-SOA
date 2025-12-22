<template>
  <div class="dashboard-stat">
    <BaseCard>
      <div class="stat-card__title">设备总数</div>
      <div class="stat-card__value">{{ stats.devices }}</div>
    </BaseCard>
    <BaseCard>
      <div class="stat-card__title">在线设备</div>
      <div class="stat-card__value">{{ stats.online }}</div>
    </BaseCard>
    <BaseCard>
      <div class="stat-card__title">告警数</div>
      <div class="stat-card__value">{{ stats.alerts }}</div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import BaseCard from '@/components/BaseCard/index.vue'
import { getDashboardStats } from '../device.api'

const stats = reactive({
  devices: 128,
  online: 102,
  alerts: 3,
})

onMounted(async () => {
  const res = await getDashboardStats()
  stats.devices = res.devices
  stats.online = res.online
  stats.alerts = res.alerts
})
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
