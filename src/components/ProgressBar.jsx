import { cn } from "../lib/utils"

export function ProgressBar({ value = 0, className }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  const color = pct > 85 ? "bg-danger" : pct >= 60 ? "bg-warning" : "bg-success"

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
