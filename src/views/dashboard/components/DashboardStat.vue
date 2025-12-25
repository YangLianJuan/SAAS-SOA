<template>
  <a-row :gutter="[layoutGutterMd, layoutGutterMd]">
    <a-col :xs="24" :md="8">
      <BaseCard>
        <div class="stat-card__title">{{ t('dashboard.stat.devicesTotal') }}</div>
        <div class="stat-card__value">{{ stats.devices }}</div>
      </BaseCard>
    </a-col>
    <a-col :xs="24" :md="8">
      <BaseCard>
        <div class="stat-card__title">{{ t('dashboard.stat.onlineDevices') }}</div>
        <div class="stat-card__value">{{ stats.online }}</div>
      </BaseCard>
    </a-col>
    <a-col :xs="24" :md="8">
      <BaseCard>
        <div class="stat-card__title">{{ t('dashboard.stat.alerts') }}</div>
        <div class="stat-card__value">{{ stats.alerts }}</div>
      </BaseCard>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import BaseCard from '@/components/BaseCard/index.vue'
import { useI18n } from '@/i18n'
import { layoutGutter } from '@/styles/tokens'
import { getDashboardStats } from '../../../api/dashboard'

const { t } = useI18n()
const layoutGutterMd = layoutGutter.md

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
