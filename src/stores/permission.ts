import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { staticRoutes } from '@/router/routes.static'

export const usePermissionStore = defineStore('permission', () => {
  const routes = computed<RouteRecordRaw[]>(() => staticRoutes)
  return { routes }
})

