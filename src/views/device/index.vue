<template>
  <div class="device-page">
    <div class="device-page__header">
      <div class="device-page__title">设备</div>
    </div>

    <ProTable
      title="设备列表"
      :columns="columns"
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
import { computed } from 'vue'

import BaseCard from '@/components/base/BaseCard/index.vue'
import ProTable from '@/components/business/ProTable/index.vue'
import StatusTag from '@/components/business/StatusTag/index.vue'
import DeviceStatus from './components/DeviceStatus.vue'

type DeviceStatusType = 'online' | 'offline' | 'error'

type Device = {
  id: string
  name: string
  status: DeviceStatusType
}

const columns = computed(() => [
  { key: 'name', title: '设备名称' },
  { key: 'status', title: '状态' },
  { key: 'actions', title: '详情' },
])

const devices = computed<Device[]>(() => [
  { id: 'd1', name: '温控器-01', status: 'online' },
  { id: 'd2', name: '网关-02', status: 'offline' },
  { id: 'd3', name: '摄像头-03', status: 'error' },
])

const statusText = (s: DeviceStatusType) => {
  if (s === 'online') return '在线'
  if (s === 'offline') return '离线'
  return '异常'
}
</script>

