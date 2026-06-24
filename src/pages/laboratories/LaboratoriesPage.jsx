import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { api } from "../../lib/api"
import { useAsync, asList } from "../../lib/useAsync"
import { useToast } from "../../context/ToastContext"
import { PageHeader } from "../../components/PageHeader"
import { Card, CardBody } from "../../components/Card"
import { DataTable } from "../../components/DataTable"
import { Button } from "../../components/Button"
import { StatusBadge } from "../../components/Badge"
import { RowActions } from "../../components/RowActions"
import { Modal } from "../../components/Modal"
import { ConfirmDialog } from "../../components/ConfirmDialog"
import { Field, Input, Select } from "../../components/Field"

const TYPES = [
  { value: "COMPUTO", label: "Cómputo" },
  { value: "REDES", label: "Redes" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "TEORICO", label: "Teórico" },
]

const STATES = [
  { value: "ACTIVO", label: "Activo" },
  { value: "EN_MANTENIMIENTO", label: "En mantenimiento" },
  { value: "CERRADO", label: "Cerrado" },
]

const empty = { codigo: "", nombre: "", tipo: "COMPUTO", capacidadMaxima: "", estado: "ACTIVO" }

export function LaboratoriesPage() {
  const toast = useToast()
  const { data, loading, refetch } = useAsync(() => api.get("/laboratories"), [])
  const labs = asList(data)

  const [typeFilter, setTypeFilter] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [search, setSearch] = useState("")

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    return labs.filter((l) => {
      if (typeFilter && l.tipo !== typeFilter) return false
      if (stateFilter && l.estado !== stateFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!`${l.nombre || ""} ${l.codigo || ""}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [labs, typeFilter, stateFilter, search])

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setModalOpen(true)
  }

  function openEdit(l) {
    setEditing(l)
    setForm({
      codigo: l.codigo || "",
      nombre: l.nombre || "",
      tipo: l.tipo || "COMPUTO",
      capacidadMaxima: l.capacidadMaxima ?? "",
      estado: l.estado || "ACTIVO",
    })
    setModalOpen(true)
  }

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, capacidadMaxima: Number(form.capacidadMaxima) || 0 }
    try {
      if (editing) {
        await api.put(`/laboratories/${editing.id}`, payload)
        toast.success("Laboratorio actualizado correctamente.")
      } else {
        await api.post("/laboratories", payload)
        toast.success("Laboratorio creado correctamente.")
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
      await api.del(`/laboratories/${toDelete.id}`)
      toast.success("Laboratorio eliminado correctamente.")
      setToDelete(null)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: "codigo", header: "Código", render: (r) => <span className="font-mono text-xs font-medium">{r.codigo}</span> },
    { key: "nombre", header: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "tipo", header: "Tipo", render: (r) => <StatusBadge value={r.tipo} /> },
    { key: "capacidadMaxima", header: "Capacidad", align: "center", render: (r) => r.capacidadMaxima },
    { key: "estado", header: "Estado", render: (r) => <StatusBadge value={r.estado} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setToDelete(r)} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Laboratorios"
        description="Administra los laboratorios, su tipo, capacidad y estado."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Laboratorio
          </Button>
        }
      />

      <Card>
        <CardBody className="border-b border-border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="sm:w-44">
              <option value="">Todos los tipos</option>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
            <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="sm:w-48">
              <option value="">Todos los estados</option>
              {STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
        <CardBody className="p-0">
          <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No se encontraron laboratorios." />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar laboratorio" : "Nuevo laboratorio"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="lab-form" loading={saving}>
              {editing ? "Guardar cambios" : "Crear laboratorio"}
            </Button>
          </>
        }
      >
        <form id="lab-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Código" required>
              <Input required placeholder="Ej. LAB-101" value={form.codigo} onChange={(e) => set("codigo", e.target.value)} />
            </Field>
            <Field label="Capacidad máxima" required>
              <Input type="number" min="0" required value={form.capacidadMaxima} onChange={(e) => set("capacidadMaxima", e.target.value)} />
            </Field>
          </div>
          <Field label="Nombre" required>
            <Input required placeholder="Ej. Laboratorio de Cómputo 1" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo" required>
              <Select value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Estado" required>
              <Select value={form.estado} onChange={(e) => set("estado", e.target.value)}>
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar laboratorio"
        message={`¿Seguro que deseas eliminar "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}
