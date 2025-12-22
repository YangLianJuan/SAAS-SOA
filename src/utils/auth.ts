const TOKEN_KEY = 'saas_token'

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  return token || null
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

