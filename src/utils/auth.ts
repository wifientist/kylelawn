const TOKEN_KEY = 'kyle_lawn_auth_token'

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
