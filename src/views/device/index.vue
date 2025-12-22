<template>
  <div class="device-page">
    <div class="device-page__header">
      <div class="device-page__title">设备</div>
    </div>

    <ProTable
      title="设备列表"
      :columns="columns"
      :loading="loading"
      :data-source="devices"
      :row-key="(r) => String((r as Device).id)"
    >
      <template #cell:status="{ record }">
        <StatusTag :status="record.status" :text="statusText(record.status)" />
      </template>
      <template #cell:actions="{ record }">
        <BaseCard variant="compact">
          <DeviceStatus :device="record" />
        </BaseCard>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BaseCard from '@/components/BaseCard/index.vue'
import ProTable from '@/components/ProTable/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import { useTable } from '@/composables/useTable'
import { getDeviceList, type Device, type DeviceStatusType } from './device.api'
import DeviceStatus from './components/DeviceStatus.vue'

const columns = computed(() => [
  { key: 'name', title: '设备名称' },
  { key: 'status', title: '状态' },
  { key: 'actions', title: '详情' },
])

const { loading, dataSource: devices, run } = useTable<Device>()

const statusText = (s: DeviceStatusType) => {
  if (s === 'online') return '在线'
  if (s === 'offline') return '离线'
  return '异常'
}

onMounted(() => {
  void run(getDeviceList)
})
</script>

<style scoped lang="less" src="./index.less"></style>
