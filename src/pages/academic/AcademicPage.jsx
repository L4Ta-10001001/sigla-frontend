import { useState } from "react"
import { PageHeader } from "../../components/PageHeader"
import { Tabs } from "../../components/Tabs"
import { PeriodsTab } from "./PeriodsTab"
import { FacultiesTab } from "./FacultiesTab"
import { CareersTab } from "./CareersTab"
import { SubjectsTab } from "./SubjectsTab"
import { TeachersTab } from "./TeachersTab"

const TABS = [
  { value: "periods", label: "Periodos" },
  { value: "faculties", label: "Facultades" },
  { value: "careers", label: "Carreras" },
  { value: "subjects", label: "Materias" },
  { value: "teachers", label: "Docentes" },
]

export function AcademicPage() {
  const [tab, setTab] = useState("periods")

  return (
    <div>
      <PageHeader title="Gestión Académica" description="Administra periodos, facultades, carreras, materias y docentes." />
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <div className="mt-6">
        {tab === "periods" && <PeriodsTab />}
        {tab === "faculties" && <FacultiesTab />}
        {tab === "careers" && <CareersTab />}
        {tab === "subjects" && <SubjectsTab />}
        {tab === "teachers" && <TeachersTab />}
      </div>
    </div>
  )
}
