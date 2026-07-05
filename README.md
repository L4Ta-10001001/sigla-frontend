# SIGLA Frontend

**S**istema de **I**nformación para la **G**estión de **L**aboratorios **A**cadémicos — Universidad Central del Ecuador.

Aplicación SPA para administrar laboratorios, horarios base, sesiones, docentes, materias y la estructura académica de la UCE.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 18 |
| Build | Vite 6 |
| Ruteo | React Router DOM v6 |
| Estilos | Tailwind CSS v4 (CSS-based config via `@theme`) |
| Iconos | Lucide React |
| Package manager | pnpm |

## Comenzar

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:5173](http://localhost:5173) (Vite asigna ese puerto por defecto).

## Demo

La app incluye un **mock backend en memoria** (~400 líneas en `src/lib/mockApi.js`) que permite probar todas las funcionalidades sin un backend real — activo por defecto.

Credenciales de demostración:

```
Email:      admin@uce.edu.ec
Contraseña: demo1234
```

Para resetear los datos seed desde la consola del navegador:

```js
window.__siglaResetMock()
```

### Backend real

Si tenés el backend corriendo, desactivá el mock:

```bash
VITE_USE_MOCK=false pnpm dev
```

La URL base del API se configura con `VITE_API_BASE_URL` (default `http://localhost:8080/api/v1`).

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo (Vite) |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build |

## Estructura

```
src/
├── components/     # 15 componentes UI reusables
├── context/        # AuthContext, PeriodContext, ToastContext
├── lib/            # api.js, mockApi.js, useAsync, utils, catalogs
├── pages/          # Login, Dashboard, Academic, Laboratories, Scheduling, Sessions
└── routes/         # AppRouter, ProtectedRoute
```

## Funcionalidades

- **Dashboard** — KPIs de laboratorios, sesiones del día, ocupación por laboratorio.
- **Gestión Académica** — CRUD de periodos, facultades, carreras, materias y docentes con asignación de materias.
- **Laboratorios** — CRUD con filtros por tipo y estado.
- **Horario Base** — Grilla semanal (lunes a sábado, 07–22h) con slots editables.
- **Sesiones** — Generación desde horario base, control de inicio/fin, registro de asistencia de docentes.
