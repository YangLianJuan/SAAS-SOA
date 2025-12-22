import { getToken } from './auth'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestConfig = {
  url: string
  method: RequestMethod
  params?: Record<string, string | number | boolean | null | undefined>
  data?: unknown
  headers?: Record<string, string>
}

const buildQueryString = (params: RequestConfig['params']) => {
  if (!params) return ''
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue
    searchParams.set(key, String(value))
  }

  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export const request = async <T>(config: RequestConfig): Promise<T> => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
  const token = getToken()

  const queryString = buildQueryString(config.params)
  const url = `${baseUrl}${config.url}${queryString}`

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...config.headers,
  }

  const isJsonBody = config.data !== undefined
  if (isJsonBody) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    method: config.method,
    headers,
    body: isJsonBody ? JSON.stringify(config.data) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return (undefined as unknown) as T
  }

  return (await res.json()) as T
}

