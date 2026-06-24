import { api } from "../../lib/api"
import { useAsync, asList } from "../../lib/useAsync"
import { CrudTab } from "./CrudTab"

export function SubjectsTab() {
  const { data } = useAsync(() => api.get("/academic/careers"), [])
  const careers = asList(data)
  const careerName = (id) => careers.find((c) => c.id === id)?.nombre || "—"

  return (
    <CrudTab
      title="Materias"
      entityLabel="Materia"
      endpoint="/academic/subjects"
      emptyForm={{ nombre: "", carreraId: "" }}
      toForm={(r) => ({ nombre: r.nombre || "", carreraId: r.carreraId || "" })}
      fields={[
        { name: "nombre", label: "Nombre", required: true, placeholder: "Ej. Programación I" },
        {
          name: "carreraId",
          label: "Carrera",
          type: "select",
          required: true,
          options: careers.map((c) => ({ value: c.id, label: c.nombre })),
        },
      ]}
      columns={[
        { key: "nombre", header: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
        { key: "carrera", header: "Carrera", render: (r) => careerName(r.carreraId) },
      ]}
    />
  )
}
