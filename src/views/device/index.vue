<template>
  <div class="device-page">
    <div class="device-page__header">
      <div class="device-page__title">{{ t('device.title') }}</div>
    </div>

    <ProTable
      :title="t('device.listTitle')"
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
import { useI18n } from '@/i18n'
import { getDeviceList, type Device, type DeviceStatusType } from './device.api'
import DeviceStatus from './components/DeviceStatus.vue'

const { t } = useI18n()

const columns = computed(() => [
  { key: 'name', title: t('device.columns.name') },
  { key: 'status', title: t('device.columns.status') },
  { key: 'actions', title: t('device.columns.actions') },
])

const { loading, dataSource: devices, run } = useTable<Device>()

const statusText = (s: DeviceStatusType) => {
  if (s === 'online') return t('device.status.online')
  if (s === 'offline') return t('device.status.offline')
  return t('device.status.error')
}

onMounted(() => {
  void run(getDeviceList)
})
</script>

<style scoped lang="less" src="./index.less"></style>
