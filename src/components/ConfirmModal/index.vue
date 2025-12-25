<template>
  <a-modal
    :open="open"
    :title="title"
    :confirm-loading="confirmLoading"
    :ok-text="resolvedOkText"
    :cancel-text="resolvedCancelText"
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

import { useI18n } from '@/i18n'

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
    danger: false,
    confirmLoading: false,
    destroyOnClose: true,
    onOk: undefined,
  },
)

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
}>()

const attrs = useAttrs()
const modalAttrs = computed(() => attrs)

const resolvedOkText = computed(() => props.okText ?? t('common.confirm'))
const resolvedCancelText = computed(() => props.cancelText ?? t('common.cancel'))

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
