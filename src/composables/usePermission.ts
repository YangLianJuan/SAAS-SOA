import { computed } from 'vue'

import { useUserStore } from '@/stores/user'
import { hasAnyRole } from '@/utils/permission'

export const usePermission = () => {
  const userStore = useUserStore()
  const roles = computed(() => userStore.roles)

  const can = (requiredRoles?: string[]) => hasAnyRole(roles.value, requiredRoles)

  return { roles, can }
}

