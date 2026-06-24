import { cn } from "../lib/utils"

const baseInput =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"

export function Label({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  )
}

export function Field({ label, required, error, children, htmlFor }) {
  return (
    <div>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn(baseInput, className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(baseInput, "appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(baseInput, "h-auto min-h-[80px] py-2 leading-relaxed", className)}
      {...props}
    />
  )
}
