import { createContext, useContext, useEffect, useState } from "react"
import { api, getToken, setToken, clearToken } from "../lib/api"

const AuthContext = createContext(null)

const USER_KEY = "sigla_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // If there's no token, ensure we don't keep a stale user around.
    if (!getToken()) {
      setUser(null)
      localStorage.removeItem(USER_KEY)
    }
    setReady(true)
  }, [])

  async function login(email, password) {
    const data = await api.post("/auth/login", { email, password })
    if (data?.accessToken) setToken(data.accessToken)
    if (data?.user) {
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    }
    return data
  }

  async function logout() {
    try {
      await api.post("/auth/logout")
    } catch {
      // Ignore network/logout errors — we still clear local state.
    } finally {
      clearToken()
      localStorage.removeItem(USER_KEY)
      setUser(null)
    }
  }

  const isAuthenticated = Boolean(user && getToken())

  return (
    <AuthContext.Provider value={{ user, ready, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
