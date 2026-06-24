import { createContext, useContext, useEffect, useState } from "react"
import { api, getToken, setToken, clearToken } from "../lib/api"

const AuthContext = createContext(null)

const USER_KEY = "sigla_user"

// Demo/mock credentials for exploring the UI without a backend.
export const DEMO_CREDENTIALS = {
  email: "admin@uce.edu.ec",
  password: "demo1234",
}

const DEMO_USER = {
  nombre: "Administrador",
  apellido: "UCE",
  email: DEMO_CREDENTIALS.email,
  rol: "Administrador",
}

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
    // Demo mode: bypass the backend entirely when demo credentials are used.
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setToken("demo-token")
      setUser(DEMO_USER)
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER))
      return { user: DEMO_USER, accessToken: "demo-token" }
    }

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
