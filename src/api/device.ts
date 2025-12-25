import { request } from '@/utils/request'

export type DeviceStatusType = 'online' | 'offline' | 'error'

export type Device = {
  id: string
  name: string
  status: DeviceStatusType
}

export const getDeviceList = async (): Promise<Device[]> => {
  try {
    return await request<Device[]>({
      url: '/device/list',
      method: 'GET',
    })
  } catch {
    return [
      { id: 'd1', name: '温控器-01', status: 'online' },
      { id: 'd2', name: '网关-02', status: 'offline' },
      { id: 'd3', name: '摄像头-03', status: 'error' },
    ]
  }
}
