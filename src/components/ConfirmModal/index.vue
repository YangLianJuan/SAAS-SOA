<template>
  <a-modal
    :open="open"
    :title="title"
    :confirm-loading="confirmLoading"
    :ok-text="okText"
    :cancel-text="cancelText"
    :ok-button-props="{ danger }"
    :destroy-on-close="destroyOnClose"
    v-bind="modalAttrs"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <slot>
      <div>{{ content }}</div>
    </slot>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    content?: string
    okText?: string
    cancelText?: string
    danger?: boolean
    confirmLoading?: boolean
    destroyOnClose?: boolean
    onOk?: () => void | Promise<void>
  }>(),
  {
    content: '',
    okText: '确定',
    cancelText: '取消',
    danger: false,
    confirmLoading: false,
    destroyOnClose: true,
    onOk: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
}>()

const attrs = useAttrs()
const modalAttrs = computed(() => attrs)

const handleCancel = () => {
  emit('cancel')
  emit('update:open', false)
}

const handleOk = async () => {
  emit('ok')
  await props.onOk?.()
  emit('update:open', false)
}
</script>
