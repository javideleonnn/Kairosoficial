# Kairos

Monorepo del ecosistema Kairos: **Mapa Kairos** (diagnóstico público),
**Aletheia** (motor de scoring), y el **CRM** privado para gestionar leads
hacia Club Kairos.

## Estructura

```
apps/
  mapa/     → Next.js público — el diagnóstico (sin login)
  crm/      → Next.js privado — gestión de leads (con login)
packages/
  types/            → tipos TypeScript compartidos
  database/         → clientes de Supabase (browser, server, service role)
  scoring-engine/   → Aletheia — motor puro + contenido de las 12 preguntas
  ui/               → componentes compartidos (Button, Screen, RadarChart, DimensionBar...)
  config/           → tsconfig base compartido
supabase/migrations/ → 7 migraciones SQL, en orden
scripts/bootstrap-owner.ts → crea la primera organización + primer usuario
docs/progress.md    → bitácora de decisiones técnicas
```

## Requisitos

Node.js 20+ y pnpm 9+. Nada más.

## Setup

```bash
pnpm install
```

### Configurar Supabase

1. Crear proyecto en supabase.com.
2. Copiar `Project URL`, `anon public key`, `service_role key`.
3. Ejecutar las 7 migraciones de `supabase/migrations/` en orden (CLI:
   `npx supabase db push`, o pegando cada archivo en el SQL Editor del
   dashboard).
4. `cp apps/mapa/.env.example apps/mapa/.env.local` y
   `cp apps/crm/.env.example apps/crm/.env.local`, completar con los
   valores reales.
5. Bootstrap del primer usuario:
   ```bash
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
   OWNER_EMAIL=... OWNER_PASSWORD=... ORG_NAME="Club Kairos" ORG_SLUG="club-kairos" \
   pnpm bootstrap:owner
   ```
   Copiar el `organization_id` que imprime en `KAIROS_ORGANIZATION_ID`
   (`apps/mapa/.env.local`).

## Comandos

```bash
pnpm dev           # levanta todas las apps en modo desarrollo
pnpm build         # build de producción de todo el monorepo
pnpm lint          # lint de todos los paquetes/apps
pnpm type-check    # chequeo de tipos de todo el monorepo
pnpm test          # pruebas automatizadas de Aletheia
```

`apps/mapa` corre en `http://localhost:3000`, `apps/crm` en
`http://localhost:3001`.

## Estado del proyecto

- [x] Módulos 1-13 (monorepo, Next.js, Supabase, Auth, diseño compartido,
  Mapa Kairos, motor Aletheia, guardado de diagnósticos, resultados,
  ManyChat, CRM v1, automatizaciones v1, optimización v1)
- [x] Revisión de metodología: cuestionario reducido de 20 a 12 preguntas
  (rediseñado desde un mapa conceptual de manifestaciones, no recortado)
- [x] Rediseño visual completo (intro, preguntas, resultado) con
  optimización de rendimiento en móvil
- [ ] Módulo 14 — Deploy (Supabase + GitHub + Vercel en producción)

Ver `/docs/progress.md` para el detalle completo de decisiones técnicas,
simplificaciones deliberadas y pendientes documentados.
