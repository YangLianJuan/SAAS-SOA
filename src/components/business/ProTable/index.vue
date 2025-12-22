<template>
  <div class="pro-table">
    <div v-if="title" class="pro-table__title">{{ title }}</div>
    <table class="pro-table__table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dataSource" :key="rowKey(row)">
          <td v-for="col in columns" :key="col.key">
            <slot :name="`cell:${col.key}`" :record="row">
              {{ (row as Record<string, unknown>)[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
type Column = { key: string; title: string }

const props = defineProps<{
  title?: string
  columns: Column[]
  dataSource: any[]
  rowKey?: (record: any) => string
}>()

const rowKey = (record: any) => {
  if (props.rowKey) return props.rowKey(record)
  return String(record?.id ?? JSON.stringify(record))
}
</script>
