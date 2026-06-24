import { CrudTab } from "./CrudTab"

export function FacultiesTab() {
  return (
    <CrudTab
      title="Facultades"
      entityLabel="Facultad"
      endpoint="/academic/faculties"
      emptyForm={{ nombre: "" }}
      fields={[{ name: "nombre", label: "Nombre", required: true, placeholder: "Ej. Ingeniería" }]}
      columns={[{ key: "nombre", header: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> }]}
    />
  )
}
