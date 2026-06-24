import { cn } from "../lib/utils"

const tones = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  info: "bg-info/10 text-info border-info/20",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
}

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone] || tones.neutral,
        className,
      )}
    >
      {children}
    </span>
  )
}

/* Maps domain status strings to label + tone. */
export const STATUS_META = {
  // Periodo
  ACTIVO: { label: "Activo", tone: "success" },
  CERRADO: { label: "Cerrado", tone: "danger" },
  // Laboratorio
  EN_MANTENIMIENTO: { label: "En mantenimiento", tone: "warning" },
  // Sesión
  PROGRAMADA: { label: "Programada", tone: "info" },
  EN_CURSO: { label: "En curso", tone: "warning" },
  FINALIZADA: { label: "Finalizada", tone: "success" },
  CANCELADA: { label: "Cancelada", tone: "danger" },
  // Asistencia docente
  LLEGO: { label: "Llegó", tone: "success" },
  RETRASO: { label: "Retraso", tone: "warning" },
  NO_LLEGO: { label: "No llegó", tone: "danger" },
  NO_REGISTRADA: { label: "No registrada", tone: "neutral" },
  // Tipo de laboratorio
  COMPUTO: { label: "Cómputo", tone: "info" },
  REDES: { label: "Redes", tone: "primary" },
  INDUSTRIAL: { label: "Industrial", tone: "warning" },
  TEORICO: { label: "Teórico", tone: "neutral" },
}

export function StatusBadge({ value, className }) {
  const meta = STATUS_META[value] || { label: value || "—", tone: "neutral" }
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  )
}
