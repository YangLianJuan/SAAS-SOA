import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { login as loginApi } from '@/api/auth'
import { clearToken, getToken, setToken } from '@/utils/auth'

type UserProfile = {
  id: string
  name: string
  roles: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() ?? '')
  const profile = ref<UserProfile | null>(null)

  const roles = computed(() => profile.value?.roles ?? [])
  const isAuthed = computed(() => Boolean(token.value))

  const login = async (payload: { username: string; password: string }) => {
    const res = await loginApi(payload)
    token.value = res.token
    setToken(res.token)
    profile.value = res.profile
  }

  const logout = () => {
    token.value = ''
    profile.value = null
    clearToken()
  }

  return { token, profile, roles, isAuthed, login, logout }
})

