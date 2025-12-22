import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const theme = ref<'light' | 'dark'>('light')
  const sidebarCollapsed = ref(false)

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const isDark = computed(() => theme.value === 'dark')

  return { theme, sidebarCollapsed, isDark, toggleTheme, toggleSidebar }
})

