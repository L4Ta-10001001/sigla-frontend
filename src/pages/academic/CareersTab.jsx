import { api } from "../../lib/api"
import { useAsync, asList } from "../../lib/useAsync"
import { CrudTab } from "./CrudTab"

export function CareersTab() {
  const { data } = useAsync(() => api.get("/academic/faculties"), [])
  const faculties = asList(data)
  const facultyName = (id) => faculties.find((f) => f.id === id)?.nombre || "—"

  return (
    <CrudTab
      title="Carreras"
      entityLabel="Carrera"
      endpoint="/academic/careers"
      emptyForm={{ nombre: "", facultadId: "" }}
      toForm={(r) => ({ nombre: r.nombre || "", facultadId: r.facultadId || "" })}
      fields={[
        { name: "nombre", label: "Nombre", required: true, placeholder: "Ej. Ingeniería en Sistemas" },
        {
          name: "facultadId",
          label: "Facultad",
          type: "select",
          required: true,
          options: faculties.map((f) => ({ value: f.id, label: f.nombre })),
        },
      ]}
      columns={[
        { key: "nombre", header: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
        { key: "facultad", header: "Facultad", render: (r) => facultyName(r.facultadId) },
      ]}
    />
  )
}
