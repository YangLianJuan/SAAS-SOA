<template>
  <div class="dashboard-page">
    <DashboardStat />
    <DashboardChart />
  </div>
</template>

<script setup lang="ts">
import DashboardStat from './components/DashboardStat.vue'
import DashboardChart from './components/DashboardChart.vue'
</script>

<style scoped lang="less" src="./index.less"></style>
