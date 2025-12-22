<template>
  <div class="pro-table">
    <div v-if="title || $slots.toolbar" class="pro-table__header">
      <div v-if="title" class="pro-table__title">{{ title }}</div>
      <div v-if="$slots.toolbar" class="pro-table__toolbar">
        <slot name="toolbar" />
      </div>
      <a-button size="small" @click="reload">刷新</a-button>
    </div>

    <a-table
      :columns="resolvedColumns"
      :data-source="displayData"
      :loading="tableLoading"
      :pagination="paginationConfig"
      :row-key="rowKey"
      :row-selection="rowSelection"
      v-bind="tableAttrs"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, useAttrs, useSlots, watch } from 'vue'

const props = defineProps<{
  title?: string
  columns: any[]
  dataSource?: any[]
  loading?: boolean
  request?: (params: {
    page: number
    pageSize: number
    sorter?: unknown
    filters?: unknown
    extra?: Record<string, unknown>
  }) => Promise<{ list: any[]; total: number }>
  rowKey?: (record: any) => string
  extraParams?: Record<string, unknown>
  rowSelection?: unknown
}>()

const rowKey = (record: any) => {
  if (props.rowKey) return props.rowKey(record)
  return String(record?.id ?? JSON.stringify(record))
}

const attrs = useAttrs()
const slots = useSlots()

const tableAttrs = computed(() => {
  const { title: _title, columns: _columns, dataSource: _ds, request: _req, ...rest } = attrs as Record<
    string,
    unknown
  >
  return rest
})

const requestLoading = ref(false)
const tableLoading = computed(() => (props.loading !== undefined ? props.loading : requestLoading.value))
const dataSourceState = ref<any[]>([])
const pagination = reactive({ current: 1, pageSize: 10, total: 0 })
const sorterState = ref<unknown>()
const filtersState = ref<unknown>()

const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const resolvedColumns = computed(() =>
  (props.columns ?? []).map((col: any) => {
    const key = String(col.dataIndex ?? col.key ?? '')
    if (!key) return col
    if (col.customRender) return col
    const slotName = `cell:${key}`
    if (!slots[slotName]) return { ...col, dataIndex: col.dataIndex ?? col.key, key: col.key ?? key }

    return {
      ...col,
      dataIndex: col.dataIndex ?? col.key,
      key: col.key ?? key,
      customRender: (ctx: any) => slots[slotName]?.({ record: ctx.record, text: ctx.text, index: ctx.index }),
    }
  }),
)

const localData = computed(() => props.dataSource ?? [])

const displayData = computed(() => {
  if (props.request) return dataSourceState.value
  const start = (pagination.current - 1) * pagination.pageSize
  return localData.value.slice(start, start + pagination.pageSize)
})

const runRequest = async () => {
  if (!props.request) return
  requestLoading.value = true
  try {
    const res = await props.request({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sorter: sorterState.value,
      filters: filtersState.value,
      extra: props.extraParams,
    })
    dataSourceState.value = res.list
    pagination.total = res.total
  } finally {
    requestLoading.value = false
  }
}

const syncLocalTotal = () => {
  if (props.request) return
  pagination.total = localData.value.length
  const maxPage = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
  if (pagination.current > maxPage) pagination.current = maxPage
}

const handleChange = (pager: any, filters: any, sorter: any) => {
  pagination.current = pager?.current ?? 1
  pagination.pageSize = pager?.pageSize ?? pagination.pageSize
  sorterState.value = sorter
  filtersState.value = filters
  if (props.request) void runRequest()
}

const reload = () => {
  if (props.request) {
    void runRequest()
    return
  }
  syncLocalTotal()
}

defineExpose({ reload })

onMounted(() => {
  if (props.request) {
    void runRequest()
  } else {
    syncLocalTotal()
  }
})

watch(
  () => props.dataSource,
  () => {
    syncLocalTotal()
  },
  { deep: true },
)

watch(
  () => props.extraParams,
  () => {
    if (props.request) void runRequest()
  },
  { deep: true },
)
</script>

<style scoped lang="less">
.pro-table__header {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  margin-bottom: @spacing-sm;
}

.pro-table__title {
  font-weight: 700;
  flex: 1;
}

.pro-table__toolbar {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
}
</style>
