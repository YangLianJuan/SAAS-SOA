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
        <BaseButton type="submit">进入系统</BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BaseButton from '@/components/base/BaseButton/index.vue'
import BaseCard from '@/components/base/BaseCard/index.vue'
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

<style scoped lang="less">
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-lg;
}

.login__card {
  width: 360px;
}

.login__title {
  font-weight: 700;
  padding-bottom: @spacing-md;
}

.login__form {
  display: grid;
  gap: @spacing-md;
}

.login__label {
  font-size: 12px;
  color: @color-text-secondary;
  margin-bottom: 6px;
}

.login__input {
  width: 100%;
  border: 1px solid @color-border;
  border-radius: @radius-sm;
  padding: 8px 10px;
  outline: none;
}
</style>

