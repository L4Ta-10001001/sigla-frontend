import { useCallback, useState } from "react"
import { Plus } from "lucide-react"
import { api } from "../../lib/api"
import { useAsync, asList } from "../../lib/useAsync"
import { useToast } from "../../context/ToastContext"
import { Card, CardHeader, CardBody } from "../../components/Card"
import { DataTable } from "../../components/DataTable"
import { Button } from "../../components/Button"
import { StatusBadge } from "../../components/Badge"
import { RowActions } from "../../components/RowActions"
import { Modal } from "../../components/Modal"
import { ConfirmDialog } from "../../components/ConfirmDialog"
import { Field, Input, Select } from "../../components/Field"
import { formatDate } from "../../lib/utils"

const empty = { nombre: "", fechaInicio: "", fechaFin: "", estado: "CERRADO" }

export function PeriodsTab() {
  const toast = useToast()
  const { data, loading, refetch } = useAsync(() => api.get("/academic/periods"), [])
  const periods = asList(data)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [warning, setWarning] = useState("")
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const hasActive = periods.some((p) => p.estado === "ACTIVO")

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setWarning("")
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditing(p)
    setForm({
      nombre: p.nombre || "",
      fechaInicio: p.fechaInicio || "",
      fechaFin: p.fechaFin || "",
      estado: p.estado || "CERRADO",
    })
    setWarning("")
    setModalOpen(true)
  }

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }))
    if (field === "estado") setWarning("")
  }

  // Whether the user is trying to set ACTIVO while another active period exists.
  function activatingConflict() {
    if (form.estado !== "ACTIVO") return false
    const otherActive = periods.find((p) => p.estado === "ACTIVO" && p.id !== editing?.id)
    return Boolean(otherActive)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (activatingConflict()) {
      setWarning("Ya existe un periodo activo. Debes cerrarlo antes de activar uno nuevo.")
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/academic/periods/${editing.id}`, form)
        toast.success("Periodo actualizado correctamente.")
      } else {
        await api.post("/academic/periods", form)
        toast.success("Periodo creado correctamente.")
      }
      setModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.del(`/academic/periods/${toDelete.id}`)
      toast.success("Periodo eliminado correctamente.")
      setToDelete(null)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: "nombre", header: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "fechaInicio", header: "Inicio", render: (r) => formatDate(r.fechaInicio) },
    { key: "fechaFin", header: "Fin", render: (r) => formatDate(r.fechaFin) },
    { key: "estado", header: "Estado", render: (r) => <StatusBadge value={r.estado} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setToDelete(r)} />,
    },
  ]

  return (
    <Card>
      <CardHeader
        title="Periodos académicos"
        subtitle="Solo puede existir un periodo activo a la vez."
        action={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Periodo
          </Button>
        }
      />
      <CardBody className="p-0">
        <DataTable columns={columns} data={periods} loading={loading} emptyMessage="No hay periodos registrados." />
      </CardBody>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar periodo" : "Nuevo periodo"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="period-form" loading={saving}>
              {editing ? "Guardar cambios" : "Crear periodo"}
            </Button>
          </>
        }
      >
        <form id="period-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre" required>
            <Input
              required
              placeholder="Ej. 2025-1"
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha inicio" required>
              <Input type="date" required value={form.fechaInicio} onChange={(e) => set("fechaInicio", e.target.value)} />
            </Field>
            <Field label="Fecha fin" required>
              <Input type="date" required value={form.fechaFin} onChange={(e) => set("fechaFin", e.target.value)} />
            </Field>
          </div>
          <Field label="Estado">
            <Select value={form.estado} onChange={(e) => set("estado", e.target.value)}>
              <option value="CERRADO">Cerrado</option>
              <option value="ACTIVO">Activo</option>
            </Select>
          </Field>

          {(warning || (activatingConflict() && hasActive)) && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5 text-sm text-warning">
              Ya existe un periodo activo. Debes cerrarlo antes de activar uno nuevo.
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar periodo"
        message={`¿Seguro que deseas eliminar el periodo "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </Card>
  )
}
