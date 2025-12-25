import { request } from '@/utils/request'

export const getDashboardStats = async () => {
  try {
    return await request<{ devices: number; online: number; alerts: number }>({
      url: '/dashboard/stats',
      method: 'GET',
    })
  } catch {
    return { devices: 128, online: 102, alerts: 3 }
  }
}

export const getDeviceTrend = async (range: '7d' | '30d') => {
  try {
    return await request<{ labels: string[]; values: number[] }>({
      url: '/dashboard/device-trend',
      method: 'GET',
      params: { range },
    })
  } catch {
    const days = range === '7d' ? 7 : 30
    const labels = Array.from({ length: days }, (_, i) => `${i + 1}`)
    const base = range === '7d' ? 80 : 60
    const values = labels.map((_, i) => base + Math.round(Math.sin(i / 2) * 12) + i)
    return { labels, values }
  }
}

