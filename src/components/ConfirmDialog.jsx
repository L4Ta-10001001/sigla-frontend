import { AlertTriangle } from "lucide-react"
import { Modal } from "./Modal"
import { Button } from "./Button"

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Eliminar", loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || "Confirmar acción"}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-5 w-5 text-danger" />
        </div>
        <p className="text-sm leading-relaxed text-foreground">{message}</p>
      </div>
    </Modal>
  )
}
