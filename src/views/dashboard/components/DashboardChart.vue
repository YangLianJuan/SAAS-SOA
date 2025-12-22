<template>
  <BaseCard>
    <template #header>
      <div class="dashboard-chart__header">
        <div class="dashboard-chart__title">设备趋势</div>
        <a-segmented v-model:value="range" :options="rangeOptions" size="small" />
      </div>
    </template>

    <EChart :option="option" height="280px" />
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EChartsOption } from 'echarts'

import BaseCard from '@/components/base/BaseCard/index.vue'
import EChart from '@/components/business/EChart/index.vue'

type Range = '7d' | '30d'

const range = ref<Range>('7d')
const rangeOptions = [
  { label: '近 7 天', value: '7d' },
  { label: '近 30 天', value: '30d' },
]

const option = computed<EChartsOption>(() => {
  const days = range.value === '7d' ? 7 : 30
  const xAxis = Array.from({ length: days }, (_, i) => `${i + 1}`)
  const base = range.value === '7d' ? 80 : 60
  const series = xAxis.map((_, i) => base + Math.round(Math.sin(i / 2) * 12) + i)

  return {
    grid: { left: 10, right: 10, top: 20, bottom: 10, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: xAxis, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: series,
        areaStyle: {},
      },
    ],
  }
})
</script>

<style scoped lang="less">
.dashboard-chart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: @spacing-md;
}

.dashboard-chart__title {
  font-weight: 700;
}
</style>

