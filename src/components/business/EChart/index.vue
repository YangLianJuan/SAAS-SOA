<template>
  <div ref="rootEl" class="saas-echart" :style="{ height }" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    height?: string
    autoresize?: boolean
  }>(),
  {
    height: '260px',
    autoresize: true,
  },
)

const rootEl = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const render = (option: EChartsOption) => {
  if (!chart) return
  chart.setOption(option, { notMerge: true, lazyUpdate: true })
}

onMounted(() => {
  if (!rootEl.value) return
  chart = echarts.init(rootEl.value)
  render(props.option)

  if (props.autoresize && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      chart?.resize()
    })
    resizeObserver.observe(rootEl.value)
  } else if (props.autoresize) {
    window.addEventListener('resize', handleWindowResize)
  }
})

const handleWindowResize = () => {
  chart?.resize()
}

watch(
  () => props.option,
  (next) => {
    render(next)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (resizeObserver && rootEl.value) resizeObserver.unobserve(rootEl.value)
  resizeObserver = null

  window.removeEventListener('resize', handleWindowResize)
  chart?.dispose()
  chart = null
})
</script>

<style scoped lang="less">
.saas-echart {
  width: 100%;
}
</style>

