<template>
  <div class="basic-layout">
    <header class="basic-layout__header">
      <div class="basic-layout__brand">SaaS</div>
      <nav class="basic-layout__nav">
        <RouterLink class="basic-layout__link" to="/dashboard">首页</RouterLink>
        <RouterLink class="basic-layout__link" to="/device">设备</RouterLink>
      </nav>
      <div class="basic-layout__actions">
        <BaseButton size="sm" @click="handleLogout">退出</BaseButton>
      </div>
    </header>
    <main class="basic-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BaseButton from '@/components/base/BaseButton/index.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  userStore.logout()
  await router.replace('/login')
}
</script>

<style scoped lang="less">
.basic-layout {
  min-height: 100vh;
}

.basic-layout__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid @color-border;
  background: @color-bg-card;
}

.basic-layout__brand {
  font-weight: 600;
}

.basic-layout__nav {
  display: flex;
  gap: 12px;
  flex: 1;
}

.basic-layout__link {
  color: @color-text-secondary;
  text-decoration: none;
}

.basic-layout__link.router-link-active {
  color: @color-text-primary;
}

.basic-layout__main {
  padding: @spacing-lg;
}
</style>

