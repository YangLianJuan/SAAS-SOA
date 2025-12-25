<template>
  <BaseCard>
    <template #header>
      <div class="dashboard-chart__header">
        <div class="dashboard-chart__title">{{ t('dashboard.chart.title') }}</div>
        <a-segmented v-model:value="range" :options="rangeOptions" size="small" />
      </div>
    </template>

    <EChart :option="option" height="280px" />
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { EChartsOption } from 'echarts'

import BaseCard from '@/components/BaseCard/index.vue'
import EChart from '@/components/EChart/index.vue'
import { useI18n } from '@/i18n'
import { getDeviceTrend } from '../../../api/dashboard'

type Range = '7d' | '30d'

const { t } = useI18n()

const range = ref<Range>('7d')
const rangeOptions = computed(() => [
  { label: t('dashboard.chart.range7d'), value: '7d' },
  { label: t('dashboard.chart.range30d'), value: '30d' },
])

const trend = ref<{ labels: string[]; values: number[] }>({ labels: [], values: [] })

const loadTrend = async () => {
  trend.value = await getDeviceTrend(range.value)
}

onMounted(() => {
  void loadTrend()
})

watch(range, () => {
  void loadTrend()
})

const option = computed<EChartsOption>(() => {
  return {
    grid: { left: 10, right: 10, top: 20, bottom: 10, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trend.value.labels, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: trend.value.values,
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
  gap: @spacing-md;
  padding-bottom: @spacing-md;
}

.dashboard-chart__title {
  font-weight: 700;
}
</style>
