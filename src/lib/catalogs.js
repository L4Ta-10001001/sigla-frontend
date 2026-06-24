import { useCallback } from "react"
import { api } from "./api"
import { useAsync, asList } from "./useAsync"

/** Loads subjects, teachers and laboratories used across scheduling & sessions forms. */
export function useCatalogs() {
  const load = useCallback(async () => {
    const [subjects, teachers, labs] = await Promise.all([
      api.get("/academic/subjects").catch(() => []),
      api.get("/academic/teachers").catch(() => []),
      api.get("/laboratories").catch(() => []),
    ])
    return {
      subjects: asList(subjects),
      teachers: asList(teachers),
      laboratories: asList(labs),
    }
  }, [])

  const { data, loading } = useAsync(load, [])

  const subjects = data?.subjects || []
  const teachers = data?.teachers || []
  const laboratories = data?.laboratories || []

  const subjectName = (id) => subjects.find((s) => s.id === id)?.nombre || id || "—"
  const teacherName = (id) => teachers.find((t) => t.id === id)?.nombre || id || "—"
  const labName = (id) => laboratories.find((l) => l.id === id)?.nombre || id || "—"
  const labCode = (id) => laboratories.find((l) => l.id === id)?.codigo || ""

  return { subjects, teachers, laboratories, subjectName, teacherName, labName, labCode, loading }
}

export const DAYS = [
  { value: "LUNES", label: "Lunes", num: 1 },
  { value: "MARTES", label: "Martes", num: 2 },
  { value: "MIERCOLES", label: "Miércoles", num: 3 },
  { value: "JUEVES", label: "Jueves", num: 4 },
  { value: "VIERNES", label: "Viernes", num: 5 },
  { value: "SABADO", label: "Sábado", num: 6 },
]

/** Normalizes a diaSemana value (string or number) to one of the DAYS entries. */
export function resolveDay(value) {
  if (value == null) return null
  const str = String(value).toUpperCase()
  return (
    DAYS.find((d) => d.value === str) ||
    DAYS.find((d) => String(d.num) === str) ||
    DAYS.find((d) => d.label.toUpperCase() === str) ||
    null
  )
}
