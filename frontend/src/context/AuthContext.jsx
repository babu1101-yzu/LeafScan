import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const API = axios.create({ baseURL: '/api' })

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('leafscan_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('leafscan_token'))
  const [loading, setLoading] = useState(true)

  // Fetch current user on mount
  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('leafscan_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    const { access_token, user: userData } = res.data
    localStorage.setItem('leafscan_token', access_token)
    setToken(access_token)
    setUser(userData)
    toast.success(`Welcome back, ${userData.username}! 🌿`)
    return userData
  }, [])

  const register = useCallback(async (username, email, password, full_name) => {
    const res = await API.post('/auth/register', { username, email, password, full_name })
    const { access_token, user: userData } = res.data
    localStorage.setItem('leafscan_token', access_token)
    setToken(access_token)
    setUser(userData)
    toast.success(`Welcome to LeafScan, ${userData.username}! 🌱`)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('leafscan_token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateProfile = useCallback(async (data) => {
    const res = await API.put('/auth/me', data)
    setUser(res.data)
    toast.success('Profile updated!')
    return res.data
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, API }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { API }
