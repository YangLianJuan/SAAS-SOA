<template>
  <div class="dashboard-page">
    <DashboardStat />
    <div class="dashboard-page__gap" />
    <DashboardChart />
  </div>
</template>

<script setup lang="ts">
import DashboardStat from './components/DashboardStat.vue'
import DashboardChart from './components/DashboardChart.vue'
</script>

<style scoped lang="less">
.dashboard-page__gap {
  height: @spacing-lg;
}
</style>

<style scoped lang="less" src="./index.less"></style>
