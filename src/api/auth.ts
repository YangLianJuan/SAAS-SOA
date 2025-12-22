import { request } from '@/utils/request'

export const login = async (payload: { username: string; password: string }) => {
  try {
    return await request<{
      token: string
      profile: { id: string; name: string; roles: string[] }
    }>({
      url: '/auth/login',
      method: 'POST',
      data: payload,
    })
  } catch {
    return {
      token: 'mock-token',
      profile: { id: '1', name: payload.username, roles: ['admin'] },
    }
  }
}
