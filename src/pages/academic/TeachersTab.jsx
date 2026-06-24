import { useCallback, useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import { api } from "../../lib/api"
import { useAsync, asList } from "../../lib/useAsync"
import { useToast } from "../../context/ToastContext"
import { Card, CardHeader, CardBody } from "../../components/Card"
import { DataTable } from "../../components/DataTable"
import { Button } from "../../components/Button"
import { Badge } from "../../components/Badge"
import { RowActions } from "../../components/RowActions"
import { Modal } from "../../components/Modal"
import { ConfirmDialog } from "../../components/ConfirmDialog"
import { Field, Input, Select } from "../../components/Field"

const empty = { nombre: "", correo: "" }

export function TeachersTab() {
  const toast = useToast()
  const { data, loading, refetch } = useAsync(() => api.get("/academic/teachers"), [])
  const teachers = asList(data)

  const { data: subjectsData } = useAsync(() => api.get("/academic/subjects"), [])
  const subjects = asList(subjectsData)
  const subjectName = useCallback(
    (id) => subjects.find((s) => s.id === id)?.nombre || id,
    [subjects],
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Assignment state (only meaningful when editing an existing teacher)
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [newSubjectId, setNewSubjectId] = useState("")
  const [addingSubject, setAddingSubject] = useState(false)

  const loadAssignments = useCallback(async (teacherId) => {
    if (!teacherId) return
    setLoadingAssign(true)
    try {
      const res = await api.get(`/academic/teacher-subjects?teacherId=${teacherId}`)
      setAssignments(asList(res))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingAssign(false)
    }
  }, [toast])

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setAssignments([])
    setModalOpen(true)
  }

  function openEdit(t) {
    setEditing(t)
    setForm({ nombre: t.nombre || "", correo: t.correo || "" })
    setNewSubjectId("")
    setModalOpen(true)
  }

  useEffect(() => {
    if (modalOpen && editing) loadAssignments(editing.id)
  }, [modalOpen, editing, loadAssignments])

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/academic/teachers/${editing.id}`, form)
        toast.success("Docente actualizado correctamente.")
      } else {
        await api.post("/academic/teachers", form)
        toast.success("Docente creado correctamente.")
      }
      setModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddSubject() {
    if (!newSubjectId || !editing) return
    setAddingSubject(true)
    try {
      await api.post("/academic/teacher-subjects", { teacherId: editing.id, subjectId: newSubjectId })
      toast.success("Materia asignada correctamente.")
      setNewSubjectId("")
      await loadAssignments(editing.id)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAddingSubject(false)
    }
  }

  async function handleRemoveSubject(assignmentId) {
    try {
      await api.del(`/academic/teacher-subjects/${assignmentId}`)
      toast.success("Materia desasignada correctamente.")
      await loadAssignments(editing.id)
      refetch()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.del(`/academic/teachers/${toDelete.id}`)
      toast.success("Docente eliminado correctamente.")
      setToDelete(null)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  // Subjects not yet assigned, for the add selector
  const assignedSubjectIds = assignments.map((a) => a.subjectId ?? a.materiaId)
  const availableSubjects = subjects.filter((s) => !assignedSubjectIds.includes(s.id))

  const columns = [
    { key: "nombre", header: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "correo", header: "Correo", render: (r) => <span className="text-muted-foreground">{r.correo}</span> },
    {
      key: "materias",
      header: "Materias asignadas",
      render: (r) => {
        const list = r.materiasAsignadas || []
        if (!list.length) return <span className="text-xs text-muted-foreground">Sin materias</span>
        return (
          <div className="flex flex-wrap gap-1">
            {list.slice(0, 3).map((m, i) => (
              <Badge key={i} tone="primary">
                {subjectName(m)}
              </Badge>
            ))}
            {list.length > 3 && <Badge tone="neutral">+{list.length - 3}</Badge>}
          </div>
        )
      },
    },
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
        title="Docentes"
        subtitle="Gestiona docentes y sus materias asignadas."
        action={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Docente
          </Button>
        }
      />
      <CardBody className="p-0">
        <DataTable columns={columns} data={teachers} loading={loading} emptyMessage="No hay docentes registrados." />
      </CardBody>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar docente" : "Nuevo docente"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="teacher-form" loading={saving}>
              {editing ? "Guardar cambios" : "Crear docente"}
            </Button>
          </>
        }
      >
        <form id="teacher-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre" required>
            <Input required placeholder="Nombre completo" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </Field>
          <Field label="Correo" required>
            <Input type="email" required placeholder="docente@uce.edu.ec" value={form.correo} onChange={(e) => set("correo", e.target.value)} />
          </Field>
        </form>

        {editing && (
          <div className="mt-5 border-t border-border pt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Materias asignadas
            </h4>

            {loadingAssign ? (
              <p className="text-sm text-muted-foreground">Cargando materias…</p>
            ) : assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Este docente no tiene materias asignadas.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assignments.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary"
                  >
                    {subjectName(a.subjectId ?? a.materiaId)}
                    <button
                      onClick={() => handleRemoveSubject(a.id)}
                      className="rounded-full p-0.5 hover:bg-primary/20"
                      aria-label="Quitar materia"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <Field label="Agregar materia">
                  <Select value={newSubjectId} onChange={(e) => setNewSubjectId(e.target.value)}>
                    <option value="">Selecciona una materia…</option>
                    {availableSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Button onClick={handleAddSubject} disabled={!newSubjectId} loading={addingSubject}>
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar docente"
        message={`¿Seguro que deseas eliminar a "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </Card>
  )
}
