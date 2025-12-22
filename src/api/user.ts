import { request } from '@/utils/request'

export const getProfile = async () => {
  try {
    return await request<{ id: string; name: string; roles: string[] }>({
      url: '/user/profile',
      method: 'GET',
    })
  } catch {
    return { id: '1', name: 'admin', roles: ['admin'] }
  }
}
