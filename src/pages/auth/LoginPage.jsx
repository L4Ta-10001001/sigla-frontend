import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { FlaskRound, Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth, DEMO_CREDENTIALS } from "../../context/AuthContext"
import { Button } from "../../components/Button"
import { Field, Input } from "../../components/Field"

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  function fillDemo() {
    setError("")
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err.message || "No fue posible iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <FlaskRound className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">SIGLA</h1>
          <p className="mt-1 text-sm text-sidebar-foreground/70">
            Sistema Integral de Gestión de Laboratorios Académicos
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <h2 className="text-lg font-semibold text-card-foreground">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa tus credenciales para continuar.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Correo electrónico" htmlFor="email" required>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-9"
                  placeholder="admin@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Field>

            <Field label="Contraseña" htmlFor="password" required>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Field>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Acceso de demostración
            </p>
            <p className="mt-2 text-sm text-card-foreground">
              Correo: <span className="font-mono">{DEMO_CREDENTIALS.email}</span>
            </p>
            <p className="text-sm text-card-foreground">
              Contraseña: <span className="font-mono">{DEMO_CREDENTIALS.password}</span>
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-3 text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Rellenar credenciales de demo
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} SIGLA — Panel administrativo
        </p>
      </div>
    </div>
  )
}
