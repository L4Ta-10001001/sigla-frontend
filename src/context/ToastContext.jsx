import { createContext, useCallback, useContext, useState } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, type, message }])
      setTimeout(() => remove(id), 4000)
    },
    [remove],
  )

  const toast = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
    info: (message) => push("info", message),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const styles = {
    success: { bar: "bg-success", icon: <CheckCircle2 className="h-5 w-5 text-success" /> },
    error: { bar: "bg-danger", icon: <AlertCircle className="h-5 w-5 text-danger" /> },
    info: { bar: "bg-info", icon: <Info className="h-5 w-5 text-info" /> },
  }
  const s = styles[toast.type] || styles.info

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className={`w-1.5 shrink-0 ${s.bar}`} />
      <div className="flex flex-1 items-start gap-3 p-3.5">
        <div className="mt-0.5 shrink-0">{s.icon}</div>
        <p className="flex-1 text-sm leading-relaxed text-card-foreground">{toast.message}</p>
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider")
  return ctx
}
