<template>
  <div class="dashboard-stat">
    <StatCard title="设备总数" :value="stats.devices" />
    <StatCard title="在线设备" :value="stats.online" />
    <StatCard title="告警数" :value="stats.alerts" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import StatCard from '@/components/business/StatCard/index.vue'

const stats = reactive({
  devices: 128,
  online: 102,
  alerts: 3,
})
</script>

