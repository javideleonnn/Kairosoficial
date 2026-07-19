# Kairos

Monorepo del ecosistema Kairos: **Mapa Kairos** (diagnóstico público),
**Aletheia** (motor de scoring), y el **CRM** privado para gestionar leads
hacia Club Kairos.

Este README cubre exactamente lo necesario para levantar el proyecto desde
cero en una máquina nueva. Para el historial de decisiones, hallazgos y
pendientes de cada módulo, ver [`/docs/progress.md`](./docs/progress.md).

---

## Estructura del monorepo

```
apps/
  mapa/                → Next.js público — el diagnóstico (sin login)
  crm/                 → Next.js privado — gestión de leads (con login)
packages/
  types/               → tipos TypeScript compartidos (fuente de verdad de dominio)
  database/            → clientes de Supabase (browser, server, service role)
  scoring-engine/      → Aletheia — motor puro de cálculo + contenido de las 20 preguntas
  ui/                  → componentes compartidos (Button, Screen, RadarChart, DimensionBar...)
  config/              → tsconfig base compartido
supabase/
  migrations/          → las 7 migraciones SQL, en orden (0001 → 0007)
scripts/
  bootstrap-owner.ts   → crea la primera organización + primer usuario (una sola vez)
docs/
  progress.md          → bitácora completa de los 14 módulos
```

---

## Requisitos

- **Node.js 20+** (ver `.nvmrc`)
- **pnpm 9+**

Nada más. No hace falta Docker, ni Supabase CLI, ni ninguna otra
herramienta instalada globalmente para desarrollar el código — solo para
levantar Supabase local si se prefiere esa vía (ver más abajo).

---

## 1. Instalar dependencias

```bash
pnpm install
```

Instala las 6 packages/apps del workspace de una sola vez (pnpm resuelve
todos los `workspace:*` automáticamente).

---

## 2. Configurar Supabase

El proyecto necesita un proyecto de Supabase real (no hay una versión
"offline" del producto — la base de datos es parte del producto).

1. Crear un proyecto en [supabase.com](https://supabase.com) (el plan
   gratuito alcanza para el MVP).
2. Ir a **Project Settings → API** y copiar:
   - `Project URL` → esto es `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → esto es `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → esto es `SUPABASE_SERVICE_ROLE_KEY` (secreta,
     nunca exponerla al cliente ni commitearla)

---

## 3. Ejecutar las migraciones

Las migraciones están en `supabase/migrations/`, numeradas y pensadas para
correr en orden. Dos formas de aplicarlas:

**Opción A — Supabase CLI (recomendada si tienes Docker):**
```bash
npx supabase login
npx supabase link --project-ref <tu-project-ref>
npx supabase db push
```

**Opción B — SQL Editor del dashboard de Supabase (sin Docker, más simple):**
Abrir cada archivo de `supabase/migrations/` en orden (`0001` → `0007`) y
pegar su contenido en **SQL Editor** del dashboard de Supabase, ejecutando
uno por uno.

Al terminar, deberían existir 7 tablas: `organizations`, `roles`,
`organization_members`, `diagnostic_sessions`, `webhook_events`,
`pipeline_stages`, `leads` — todas con Row Level Security habilitado.

---

## 4. Configurar variables de entorno

Cada app tiene su propio `.env.example` — copiarlo a `.env.local` en la
misma carpeta y completar los valores reales.

```bash
cp apps/mapa/.env.example apps/mapa/.env.local
cp apps/crm/.env.example apps/crm/.env.local
```

**`apps/mapa/.env.local`** (el diagnóstico público):
| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Paso 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Paso 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Paso 2 (usada por el Route Handler que guarda diagnósticos) |
| `KAIROS_ORGANIZATION_ID` | El `id` de tu organización — se obtiene después del Paso 5 (bootstrap) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número, formato internacional sin `+` (ej. `50212345678`) |
| `MANYCHAT_API_TOKEN` | Cuenta de ManyChat → Settings → API |
| `MANYCHAT_FLOW_NS` | El flow que se dispara al completar el diagnóstico |
| `MANYCHAT_FIELD_ID_RESULT_CODE` / `MANYCHAT_FIELD_ID_DOMINANT_BLOCK` | Custom fields creados en ManyChat (opcionales) |
| `MANYCHAT_WEBHOOK_SECRET` | Inventa un secreto — se usa para validar el webhook entrante |

**`apps/crm/.env.local`** (el panel privado):
| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Paso 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Paso 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Paso 2 |

---

## 5. Crear la primera organización y usuario (bootstrap)

El login del CRM es por invitación — no hay signup público. Hay que crear
manualmente la primera organización y el primer usuario `owner`, **una
sola vez**:

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key \
OWNER_EMAIL=javi@ejemplo.com \
OWNER_PASSWORD=una-contraseña-segura \
ORG_NAME="Club Kairos" \
ORG_SLUG="club-kairos" \
pnpm bootstrap:owner
```

Al terminar, imprime el `organization_id` real — cópialo en
`KAIROS_ORGANIZATION_ID` en `apps/mapa/.env.local` (Paso 4).

---

## 6. Iniciar las apps en desarrollo

```bash
# Mapa Kairos (público) — http://localhost:3000
pnpm --filter @kairos/mapa dev

# Kairos CRM (privado) — http://localhost:3001
pnpm --filter @kairos/crm dev
```

O ambas a la vez desde la raíz:
```bash
pnpm dev
```

Inicia sesión en el CRM (`http://localhost:3001/login`) con el email/
contraseña del Paso 5. Completa el diagnóstico en Mapa Kairos
(`http://localhost:3000`) — el lead debería aparecer automáticamente en el
Kanban del CRM (gracias a los triggers de Postgres del Módulo 11).

---

## 7. Ejecutar los tests

```bash
pnpm test
```

Corre las 20 pruebas automatizadas del motor Aletheia (`@kairos/scoring-engine`)
— perfiles representativos, empates, y validación de respuestas inválidas.
Ver `/docs/progress.md`, Módulo 7, para el detalle de qué cubre cada una.

---

## 8. Generar build de producción

```bash
pnpm type-check   # chequeo de tipos de las 6 packages/apps
pnpm build        # build de producción de ambas apps
```

Ambos comandos deben terminar en verde antes de desplegar. Si algo falla,
revisar primero que los pasos 2-5 estén completos — la mayoría de errores
en este punto son de configuración (variables de entorno faltantes), no
del código.

---

## Comandos de referencia

```bash
pnpm install       # instalar dependencias (una vez, y cada vez que cambien)
pnpm dev           # levantar todas las apps en modo desarrollo
pnpm build         # build de producción de todo el monorepo
pnpm lint          # lint de todos los paquetes/apps
pnpm type-check    # chequeo de tipos de todo el monorepo
pnpm test          # pruebas automatizadas (Aletheia)
pnpm bootstrap:owner  # crear la primera organización + usuario (una sola vez)
```

---

## Estado del proyecto

- [x] Módulo 1 — Inicialización del monorepo
- [x] Módulo 2 — Configuración de Next.js
- [x] Módulo 3 — Configuración de Supabase
- [x] Módulo 4 — Sistema de autenticación
- [x] Módulo 5 — Sistema de diseño compartido
- [x] Módulo 6 — Construcción de Mapa Kairos
- [x] Módulo 7 — Motor Aletheia
- [x] Módulo 8 — Guardado de diagnósticos
- [x] Módulo 9 — Pantalla de resultados
- [x] Módulo 10 — Integración con ManyChat
- [x] Módulo 11 — CRM (v1)
- [x] Módulo 12 — Automatizaciones (v1)
- [x] Módulo 13 — Optimización (v1)
- [ ] Módulo 14 — Deploy (pendiente, sesión final con Supabase + GitHub + Vercel reales)

El proyecto fue verificado de principio a fin con una instalación limpia
(`node_modules` eliminado y reinstalado desde cero) — `pnpm install`,
`pnpm type-check`, `pnpm build` y `pnpm test` corren en verde sin ningún
artefacto de sesiones anteriores.

Para el detalle completo de decisiones técnicas, simplificaciones
deliberadas, hallazgos y pendientes de cada módulo, ver
[`/docs/progress.md`](./docs/progress.md).
