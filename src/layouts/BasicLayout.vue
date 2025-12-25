<template>
  <a-layout class="basic-layout">
    <a-layout-header class="basic-layout__header">
      <div class="basic-layout__header-left">
        <div class="basic-layout__brand" @click="handleGoHome">
          <div class="basic-layout__brand-mark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
              />
            </svg>
          </div>
          <div class="basic-layout__brand-text">{{ t('common.brand') }}</div>
        </div>

        <a-button class="basic-layout__icon-btn" type="text" @click="handleToggleSidebar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </a-button>
      </div>

      <div class="basic-layout__header-right">
        <div class="basic-layout__search">
          <a-input v-model:value="searchText" allow-clear :placeholder="t('common.searchPlaceholder')" />
        </div>

        <a-badge dot>
          <a-button class="basic-layout__icon-btn" type="text">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
              />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </a-button>
        </a-badge>

        <a-dropdown :trigger="['click']">
          <div class="basic-layout__user">
            <a-avatar class="basic-layout__avatar" :size="36">{{ userInitial }}</a-avatar>
            <div class="basic-layout__user-info">
              <div class="basic-layout__user-name">{{ userName }}</div>
              <div class="basic-layout__user-role">{{ userRole }}</div>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <template #overlay>
            <a-menu @click="handleUserMenuClick">
              <a-menu-item key="locale:zh-CN">
                {{ t('common.lang.zhCN') }}
              </a-menu-item>
              <a-menu-item key="locale:en-US">
                {{ t('common.lang.enUS') }}
              </a-menu-item>
              <a-menu-item key="logout">{{ t('common.logout') }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <a-layout class="basic-layout__body">
      <a-layout-sider
        class="basic-layout__sider"
        :width="256"
        :collapsed="sidebarCollapsed"
        :collapsed-width="collapsedWidth"
        :trigger="null"
        @update:collapsed="handleCollapsedChange"
      >
        <div class="basic-layout__sider-inner">
          <div class="basic-layout__sider-section">{{ t('common.mainNavigation') }}</div>
          <a-menu
            class="basic-layout__menu"
            theme="dark"
            mode="inline"
            :selected-keys="selectedKeys"
            @click="handleMenuClick"
          >
            <a-menu-item v-for="item in menuItems" :key="item.key">{{ item.title }}</a-menu-item>
          </a-menu>
        </div>
      </a-layout-sider>

      <a-layout-content class="basic-layout__content">
        <div class="basic-layout__content-inner">
          <RouterView />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useI18n } from '@/i18n'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const { sidebarCollapsed } = storeToRefs(appStore)

const { t, setLocale } = useI18n()
const { isMobile } = useBreakpoint()

const searchText = ref('')

const menuItems = computed(() => {
  const keys = ['/dashboard', '/device']

  return keys.map((key) => {
    if (key === '/dashboard') return { key, title: t('common.nav.dashboard') }
    if (key === '/device') return { key, title: t('common.nav.device') }
    return { key, title: key }
  })
})

const selectedKeys = computed(() => {
  const match = menuItems.value.find((i) => route.path === i.key || route.path.startsWith(`${i.key}/`))
  return [match?.key ?? '/dashboard']
})

watch(
  isMobile,
  (v) => {
    if (v) sidebarCollapsed.value = true
  },
  { immediate: true },
)

const collapsedWidth = computed(() => (isMobile.value ? 0 : 72))

const handleGoHome = async () => {
  await router.push('/dashboard')
}

const handleToggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleCollapsedChange = (next: boolean) => {
  sidebarCollapsed.value = next
}

const handleMenuClick = async (e: { key: string }) => {
  await router.push(e.key)
}

const handleLogout = async () => {
  userStore.logout()
  await router.replace('/login')
}

const handleUserMenuClick = async (e: { key: string }) => {
  if (e.key === 'logout') {
    await handleLogout()
    return
  }
  if (e.key === 'locale:zh-CN') {
    setLocale('zh-CN')
    return
  }
  if (e.key === 'locale:en-US') {
    setLocale('en-US')
  }
}

const userName = computed(() => userStore.profile?.name ?? '')
const userRole = computed(() => userStore.roles[0] ?? '')
const userInitial = computed(() => {
  const name = userName.value.trim()
  return name ? name.slice(0, 1).toUpperCase() : ''
})
</script>

<style scoped lang="less">
.basic-layout {
  min-height: 100vh;
  background: @color-bg-page;
}

.basic-layout__header {
  height: 64px;
  padding: 0 @spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: @color-bg-card;
  border-bottom: 1px solid @color-border;
  line-height: 64px;
}

.basic-layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.basic-layout__brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, @color-layout-sider-bg 0%, @color-primary 100%);
}

.basic-layout__brand-text {
  font-size: 18px;
  font-weight: 700;
  color: @color-text-primary;
  letter-spacing: 0.2px;
}

.basic-layout__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.basic-layout__header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.basic-layout__search {
  width: 280px;
}

.basic-layout__icon-btn {
  padding: 0 8px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: @color-text-secondary;
}

.basic-layout__icon-btn:hover {
  color: @color-text-primary;
}

.basic-layout__user {
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border-radius: 999px;
  cursor: pointer;
}

.basic-layout__user:hover {
  background: rgba(0, 0, 0, 0.03);
}

.basic-layout__user-info {
  line-height: 1.1;
}

.basic-layout__user-name {
  font-weight: 700;
  color: @color-text-primary;
  font-size: 13px;
}

.basic-layout__user-role {
  font-size: 10px;
  color: @color-text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 2px;
}

.basic-layout__body {
  min-height: calc(100vh - 64px);
}

.basic-layout__sider {
  background: @color-layout-sider-bg;
}

.basic-layout__sider-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 18px 0;
}

.basic-layout__sider-section {
  padding: 0 16px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: @color-layout-sider-text-muted;
}

.basic-layout__menu {
  padding: 0 8px;
}

.basic-layout__menu :deep(.ant-menu) {
  background: transparent;
}

.basic-layout__menu :deep(.ant-menu-item) {
  color: @color-layout-sider-text;
  border-radius: 10px;
  height: 44px;
  line-height: 44px;
  margin: 6px 0;
}

.basic-layout__menu :deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.basic-layout__menu :deep(.ant-menu-item-selected) {
  background: @color-layout-sider-active-bg;
}

.basic-layout__menu :deep(.ant-menu-item-selected::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: #fff;
  border-radius: 0 6px 6px 0;
}

.basic-layout__menu :deep(.ant-menu-item-selected .ant-menu-title-content) {
  color: #fff;
  font-weight: 700;
}

.basic-layout__content {
  background: @color-bg-page;
}

.basic-layout__content-inner {
  height: 100%;
  padding: @spacing-xl;
  overflow: auto;
}

@media (max-width: @breakpoint-sm) {
  .basic-layout__search {
    display: none;
  }

  .basic-layout__user-info {
    display: none;
  }

  .basic-layout__content-inner {
    padding: @spacing-lg;
  }
}
</style>
