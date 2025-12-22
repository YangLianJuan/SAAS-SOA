import { createRouter, createWebHistory } from 'vue-router'

import { staticRoutes } from './routes.static'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const isPublic = Boolean(to.meta?.public)

  if (isPublic) return true
  if (userStore.token) return true

  return { path: '/login', query: { redirect: to.fullPath } }
})

export default router

