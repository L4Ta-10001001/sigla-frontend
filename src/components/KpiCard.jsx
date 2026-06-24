import { cn } from "../lib/utils"

const accents = {
  blue: { icon: "bg-primary/10 text-primary", bar: "bg-primary" },
  green: { icon: "bg-success/10 text-success", bar: "bg-success" },
  orange: { icon: "bg-warning/10 text-warning", bar: "bg-warning" },
  red: { icon: "bg-danger/10 text-danger", bar: "bg-danger" },
}

export function KpiCard({ icon: Icon, label, value, accent = "blue", loading }) {
  const a = accents[accent] || accents.blue
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <span className={cn("absolute inset-x-0 top-0 h-1", a.bar)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {loading ? "—" : (value ?? 0)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", a.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
