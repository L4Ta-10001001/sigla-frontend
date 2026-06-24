export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(value) {
  if (!value) return "—"
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return value
  }
}

export function formatTime(value) {
  if (!value) return "—"
  // Accept "HH:mm:ss" or "HH:mm"
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5)
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return value
  }
}
