<template>
  <span class="status-tag" :class="statusClass">{{ text }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'online' | 'offline' | 'error'
  text: string
}>()

const statusClass = computed(() => `status-tag--${props.status}`)
</script>

<style scoped lang="less">
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid @color-border;
  font-size: 12px;
  color: @color-text-primary;
  background: @color-bg-card;
}

.status-tag--online {
  border-color: #b7eb8f;
  background: #f6ffed;
  color: #389e0d;
}

.status-tag--offline {
  border-color: #d9d9d9;
  background: #fafafa;
  color: #595959;
}

.status-tag--error {
  border-color: #ffccc7;
  background: #fff2f0;
  color: #cf1322;
}
</style>

