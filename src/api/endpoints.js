import api from './axiosInstance'

// ── Auth ─────────────────────────────────────────────────────
export const login = (data) =>
  api.post('/auth/public/login', data)

export const register = (data) =>
  api.post('/auth/public/register', data)

// ── URLs ─────────────────────────────────────────────────────
export const shortenUrl = (originalUrl) =>
  api.post('/urls/shorten', { originalUrl })

export const getMyUrls = () =>
  api.get('/urls/myurls')

export const deleteUrl = (shortUrl) =>
  api.delete(`/urls/${shortUrl}`)

export const toggleActive = (shortUrl) =>
  api.patch(`/urls/${shortUrl}/toggle-active`)

// ── Analytics ────────────────────────────────────────────────
export const getUrlAnalytics = (shortUrl, startDate, endDate) =>
  api.get(`/analytics/daily/${shortUrl}`, { params: { startDate, endDate } })

export const getTotalClicks = (startDate, endDate) =>
  api.get('/analytics/total', { params: { startDate, endDate } })

export const getAdvancedAnalytics = (shortUrl) =>
  api.get(`/analytics/${shortUrl}`)

// ── Users ────────────────────────────────────────────────────
export const getProfile = () =>
  api.get('/users/profile')

export const updateUsername = (data) =>
  api.patch('/users/profile/username', data)

export const updatePassword = (data) =>
  api.patch('/users/profile/password', data)

export const deleteAccount = () =>
  api.delete('/users/profile')

// ── API Keys (Developers) ────────────────────────────────────
export const getApiKeys = () =>
  api.get('/keys')

export const createApiKey = (data) =>
  api.post('/keys', data)

export const revokeApiKey = (id) =>
  api.delete(`/keys/${id}`)
