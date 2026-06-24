import { useCallback } from "react"
import {
  FlaskConical,
  CircleCheck,
  Wrench,
  CircleX,
  RefreshCw,
  Clock,
  User,
  CalendarClock,
} from "lucide-react"
import { api } from "../../lib/api"
import { useAsync, asList } from "../../lib/useAsync"
import { PageHeader } from "../../components/PageHeader"
import { KpiCard } from "../../components/KpiCard"
import { Card, CardHeader, CardBody } from "../../components/Card"
import { Button } from "../../components/Button"
import { StatusBadge } from "../../components/Badge"
import { ProgressBar } from "../../components/ProgressBar"
import { formatTime } from "../../lib/utils"

export function DashboardPage() {
  const loadAll = useCallback(async () => {
    const [summary, today, occupancy] = await Promise.all([
      api.get("/dashboard/summary").catch(() => ({})),
      api.get("/dashboard/today-sessions").catch(() => []),
      api.get("/dashboard/laboratory-occupancy").catch(() => []),
    ])
    return { summary: summary || {}, today: asList(today), occupancy: asList(occupancy) }
  }, [])

  const { data, loading, refetch } = useAsync(loadAll, [])
  const summary = data?.summary || {}
  const today = data?.today || []
  const occupancy = data?.occupancy || []

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general del estado de los laboratorios y la actividad del día."
        actions={
          <Button variant="secondary" onClick={() => refetch()} loading={loading}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={FlaskConical} label="Total de laboratorios" value={summary.totalLaboratories} accent="blue" loading={loading} />
        <KpiCard icon={CircleCheck} label="Activos" value={summary.active} accent="green" loading={loading} />
        <KpiCard icon={Wrench} label="En mantenimiento" value={summary.maintenance} accent="orange" loading={loading} />
        <KpiCard icon={CircleX} label="Cerrados" value={summary.closed} accent="red" loading={loading} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's sessions */}
        <Card>
          <CardHeader title="Sesiones de hoy" subtitle={`${today.length} sesión(es) programadas`} />
          <CardBody className="p-0">
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">Cargando…</div>
            ) : today.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-muted-foreground">
                <CalendarClock className="h-8 w-8" />
                <p className="text-sm">No hay sesiones programadas para hoy.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {today.map((s) => (
                  <li key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="flex w-16 shrink-0 flex-col">
                      <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatTime(s.horaInicio)}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTime(s.horaFin)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {s.materia || s.materiaNombre || "Materia"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.laboratorio || s.laboratorioNombre || s.laboratorioCodigo || "Laboratorio"}
                        {" · "}
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {s.docente || s.docenteNombre || "Docente"}
                        </span>
                      </p>
                    </div>
                    <StatusBadge value={s.estado} />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Occupancy */}
        <Card>
          <CardHeader title="Ocupación por laboratorio" subtitle="Uso actual de cada laboratorio" />
          <CardBody className="space-y-4">
            {loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Cargando…</div>
            ) : occupancy.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No hay datos de ocupación.
              </div>
            ) : (
              occupancy.map((lab) => {
                const max = lab.capacidadMaxima ?? lab.capacity ?? 0
                const current = lab.ocupados ?? lab.current ?? 0
                const pct =
                  lab.ocupacion ?? lab.occupancy ?? (max > 0 ? (current / max) * 100 : 0)
                const libre = !current
                return (
                  <div key={lab.id || lab.codigo}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {lab.nombre || lab.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{lab.codigo || lab.code}</p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-muted-foreground">
                        {libre ? "Libre" : `${current}/${max} estudiantes`}
                      </span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                )
              })
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
