<template>
  <div class="login">
    <BaseCard class="login__card">
      <template #header>
        <div class="login__title">登录</div>
      </template>
      <form class="login__form" @submit.prevent="handleSubmit">
        <label class="login__field">
          <div class="login__label">用户名</div>
          <input v-model.trim="form.username" class="login__input" autocomplete="username" />
        </label>
        <label class="login__field">
          <div class="login__label">密码</div>
          <input
            v-model.trim="form.password"
            class="login__input"
            type="password"
            autocomplete="current-password"
          />
        </label>
        <a-button type="primary" html-type="submit">进入系统</a-button>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BaseCard from '@/components/BaseCard/index.vue'
import { useForm } from '@/composables/useForm'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const { model: form } = useForm({ username: 'admin', password: '123456' })

const handleSubmit = async () => {
  await userStore.login({ username: form.username, password: form.password })
  await router.replace('/dashboard')
}
</script>

<style scoped lang="less" src="./index.less"></style>
