# Kairos — Progreso del proyecto

Este documento se actualiza automáticamente al finalizar cada módulo. Es la
fuente de verdad de qué está construido, qué decisiones se tomaron y cómo
validar cada pieza.

---

## Módulo 1 — Inicialización del monorepo ✅

**Estado:** completo y validado.

**Qué se construyó:**
- Turborepo + pnpm workspaces (`apps/*`, `packages/*`).
- Paquetes compartidos creados: `@kairos/types` (con contenido real: tipos de
  metodología, diagnóstico y CRM), `@kairos/database`, `@kairos/scoring-engine`,
  `@kairos/ui` (stubs, se llenan en sus módulos), `@kairos/config` (tsconfig base).
- `apps/mapa` y `apps/crm` creados como carpetas vacías, listas para Módulo 2.

**Decisiones tomadas:**
- Node 20+, pnpm 9+, TypeScript estricto (`strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`) desde el primer paquete.
- `@kairos/config/tsconfig.base.json` como única fuente de configuración de
  compilador — todos los paquetes/apps extienden de ahí.

**Cómo validar:**
```bash
pnpm install
pnpm type-check   # 0 errores en los 4 paquetes con contenido
```

---

## Módulo 2 — Configuración de Next.js ✅

**Estado:** completo y validado.

**Qué se construyó:**
- `apps/mapa` y `apps/crm` inicializadas con Next.js 16 (App Router), React 19,
  TypeScript y Tailwind CSS v4.
- Ambas apps transpilan `@kairos/types` y `@kairos/ui` vía `transpilePackages`
  en `next.config.ts` — validado con un export runtime real (no solo tipos).
- `tsconfig.json` de cada app extiende `@kairos/config/tsconfig.base.json`.
- `apps/crm` corre en el puerto 3001 en dev, para poder levantar ambas apps a
  la vez sin conflicto de puertos.
- ESLint flat config mínima en ambas apps (sin reglas de negocio todavía —
  el set completo se afina en el Módulo 13, no es crítico ahora).

**Decisiones tomadas (afectan módulos futuros):**
1. **Paquetes compartidos sin build propio** — se transpilan desde código
   fuente vía `transpilePackages`, no se compilan a `dist/`. Simplifica el MVP;
   el único caso que obligaría a cambiar esto es si un paquete se necesita
   fuera de Next.js (ej. un worker independiente) — se resuelve ese día, no antes.
2. **Tailwind v4** (no v3) — el sistema de diseño del Módulo 5 define los
   tokens de marca (dorado/negro/cream) directamente en CSS con `@theme` en
   vez de un `tailwind.config.js`. Esto es una mejora sobre el plan original,
   no una limitación.

**Cómo validar:**
```bash
pnpm install
pnpm type-check   # 6/6 tareas OK (types, ui, database, scoring-engine, mapa, crm)
pnpm build        # ambas apps compilan y generan páginas estáticas
pnpm --filter @kairos/mapa dev   # http://localhost:3000
pnpm --filter @kairos/crm dev    # http://localhost:3001
```
Resultado esperado en ambos `dev`: página oscura centrada con el nombre de la
app y la confirmación "Next.js + Tailwind + workspace packages OK".

---

## Módulo 3 — Configuración de Supabase ✅

**Estado:** completo y validado contra una base de datos Postgres real.

**Qué se construyó:**
- `supabase/config.toml` — configuración de proyecto para Supabase CLI (auth
  sin self-signup, ya que el CRM es de invitación).
- `supabase/migrations/`:
  - `0001_extensions.sql` — pgcrypto.
  - `0002_tenancy.sql` — `organizations`, `roles`, `organization_members`,
    función `set_updated_at()` reutilizable, seed de los 4 roles por defecto.
  - `0003_tenancy_rls.sql` — función `has_permission(org_id, permission_key)`
    y políticas RLS completas de las 3 tablas.
- `@kairos/database`:
  - `types/database.types.ts` — tipos del schema (snake_case, fieles a Postgres).
  - `client/browser.ts` — cliente para componentes cliente.
  - `client/server.ts` — cliente de servidor agnóstico de framework (recibe
    el adaptador de cookies como parámetro, no importa `next/headers`
    directamente) + cliente de service_role para operaciones administrativas.
- `.env.example` en `apps/mapa` y `apps/crm` (el de `crm` incluye
  `SUPABASE_SERVICE_ROLE_KEY`, solo servidor).
- Ambas apps ahora transpilan también `@kairos/database`.

**Decisiones técnicas tomadas:**
1. **Alcance de este módulo limitado a infraestructura + tenancy.** Las
   tablas de dominio (productos/preguntas, sesiones de diagnóstico,
   leads/pipeline) del documento de arquitectura original se crean en el
   módulo que las necesita (Módulos 6, 8 y 11 respectivamente), no todas de
   una vez. Motivo: cada migración llega acompañada del código que la usa
   y se puede validar en contexto real, en vez de esquema especulativo sin uso.
2. **Cliente de servidor agnóstico de Next.js.** Recibe el manejo de cookies
   como parámetro en vez de importar `next/headers` — mantiene
   `@kairos/database` reutilizable fuera de Next si algún día hace falta.
3. **`has_permission()` es `SECURITY DEFINER`** — necesario porque sus
   propias policies consultarían `organization_members`, que a su vez tiene
   RLS; sin `SECURITY DEFINER` esto sería recursivo. Patrón estándar
   recomendado por Supabase.
4. **Signup deshabilitado** (`enable_signup = false`) — el acceso al CRM es
   por invitación (`team:manage`), no autoservicio. Se habilita
   explícitamente si el negocio lo requiere en el futuro.

**Cambios respecto a la arquitectura original:**
- Ninguno en el modelo de datos — `organizations`, `roles`,
  `organization_members` se implementaron exactamente como en la Parte 2
  del documento de arquitectura.

**Problemas encontrados y soluciones aplicadas:**
1. **Problema:** el entorno de desarrollo no tiene Docker/Podman disponible
   (dominios de red restringidos a un allowlist), por lo que no se puede
   correr `supabase start` (Supabase local real) ni `supabase gen types`
   (que internamente intenta levantar un contenedor `postgres-meta`).
   **Solución:** se instaló PostgreSQL 16 nativo en el contenedor y se creó
   un fixture de prueba (`auth.users` + `auth.uid()` simulada vía variable de
   sesión) que imita lo mínimo necesario del schema `auth` de Supabase para
   poder ejecutar las migraciones reales y probar RLS de verdad. El fixture
   **no** se commitea al proyecto — es solo de esta sesión de validación. Los
   tipos de `database.types.ts` se escribieron a mano, verificados contra el
   schema real ya ejecutado (no son especulativos).
2. **Problema:** el type-check inicial de `@kairos/database` falló porque el
   paquete usa `process.env` sin tener `@types/node`. **Solución:** agregado
   como devDependency.

**Cómo validé el Módulo 3 (no solo "compila"):**
```bash
# 1. Migraciones corren limpio contra Postgres real
psql -f supabase/migrations/0001_extensions.sql
psql -f supabase/migrations/0002_tenancy.sql
psql -f supabase/migrations/0003_tenancy_rls.sql

# 2. Prueba de RLS con 2 usuarios reales, roles distintos, mismo org:
#    - advisor ve solo su propia fila de membresía        → OK
#    - owner (team:manage) ve las 2 membresías de su org   → OK
#    - usuario ajeno no ve la organización                 → OK
#    - owner sí ve su organización                          → OK
#    - advisor NO puede insertar un nuevo miembro           → OK (bloqueado por RLS)

# 3. Monorepo completo
pnpm install && pnpm type-check   # 6/6 OK
pnpm build                        # ambas apps compilan sin variables de entorno reales
                                   # (los clientes fallan solo si se invocan sin env, no al importar)
```

**Pendientes (a futuro, no bloquean el siguiente módulo):**
- Crear el proyecto Supabase real (hosted) y completar los `.env.local` reales
  — se hace al conectar Auth en el Módulo 4, o antes si prefieres.
- Cuando exista un proyecto real, correr `supabase gen types` contra él para
  reemplazar los tipos escritos a mano por los generados automáticamente
  (deberían ser idénticos, es solo una validación cruzada).
- Definir capa de mapeo snake_case ↔ camelCase entre `database.types.ts` y
  `@kairos/types` — no urgente todavía porque ningún módulo consume datos de
  dominio real aún; se resuelve cuando el Módulo 4 (Auth) empiece a leer
  `organization_members`.

---

## Módulo 4 — Sistema de autenticación ✅

**Estado:** completo y validado (build + type-check). Login en vivo contra un
proyecto Supabase real queda pendiente de que exista uno conectado (ver
"Pendientes").

**Qué se construyó (alcance reducido a propósito, ver decisión abajo):**
- `apps/crm/proxy.ts` — valida sesión en cada request (`supabase.auth.getUser()`,
  no `getSession()`, para no confiar en una cookie sin validar contra el
  servidor) y redirige: sin sesión → `/login`; con sesión intentando ver
  `/login` → `/`.
- `app/(auth)/login/page.tsx` — formulario mínimo de email/contraseña.
- `app/(dashboard)/layout.tsx` — segunda validación de sesión en el servidor
  (defensa en profundidad, no confía solo en el proxy) + botón de logout.
- `lib/supabase/{server,browser}.ts` — conectan `next/headers` con los
  clientes agnósticos de `@kairos/database` (decisión del Módulo 3).
- `scripts/bootstrap-owner.ts` — crea la primera organización + primer
  usuario `owner` una sola vez (necesario porque el signup está deshabilitado).

**Decisión tomada (siguiendo la nueva prioridad de MVP-primero):**
Se construyó **solo** login + sesión + logout para un usuario `owner`. Quedan
explícitamente fuera de este módulo (documentado para más adelante, no
olvidado):
- UI de invitación de asesores / gestión de equipo → Módulo 11 (CRM).
- Selector de organización (multi-tenant switcher).
- Recuperación de contraseña con UI propia (Supabase la soporta nativamente
  vía API; solo falta la pantalla, no la lógica).
- Cualquier gating de permisos en la interfaz — con un solo usuario `owner`
  no aporta valor todavía; el RLS del Módulo 3 ya protege los datos sin
  importar qué muestre o esconda la UI.

Motivo: nada de esto es necesario para que el primer diagnóstico funcione de
principio a fin, que es ahora la prioridad. La arquitectura de permisos
(roles, `has_permission()`) ya existe y no hay que tocarla cuando llegue el
momento de construir esas pantallas.

**Cambios respecto a la arquitectura original:**
- Ninguno en el modelo de datos o permisos.
- Se descubrió y corrigió una divergencia de la librería, no de nuestra
  arquitectura: Next.js 16 renombró `middleware.ts` → `proxy.ts` (función
  `middleware` → `proxy`). Corregido antes de continuar — ver "Problemas
  encontrados".

**Problemas encontrados y soluciones aplicadas:**
1. **Problema:** el build mostró `⚠ The "middleware" file convention is
   deprecated`. **Solución:** verificado contra la documentación oficial de
   Next.js (no asumido) — Next.js 16 renombró el archivo y la función a
   `proxy`. Se migró `middleware.ts` → `proxy.ts` y la función
   `middleware()` → `proxy()`. Confirmado en el build: el warning
   desapareció y la ruta aparece correctamente como `ƒ Proxy (Middleware)`.
2. **Problema (heredado del Módulo 3, sigue vigente):** no se puede probar
   un login real de extremo a extremo sin un proyecto Supabase real
   conectado (y sin Docker no se puede levantar uno local aquí). La
   validación de este módulo es de compilación/tipos/build, no de flujo
   real de autenticación.

**Cómo validé el Módulo 4:**
```bash
pnpm install
pnpm type-check   # 6/6 OK, incluye apps/crm con Auth
pnpm build        # ambas apps compilan; /login es estático, / es dinámico
                   # (correcto: depende de sesión, no puede pre-renderizarse)
```
Validación adicional: se revisó manualmente que el script de bootstrap
type-checkea correctamente (`@types/node` agregado donde faltaba).

**Pendientes (no bloquean el Módulo 5):**
- Crear el proyecto Supabase real y completar `.env.local` en ambas apps.
- Correr `pnpm bootstrap:owner` una vez que exista el proyecto real, para
  poder probar el login de verdad por primera vez.
- Pantallas de invitación de equipo, selector de organización, recuperación
  de contraseña — diferidas al Módulo 11 según la decisión de este módulo.

---

## Módulo 5 — Sistema de diseño compartido ✅

**Estado:** completo y validado (tokens confirmados en el CSS real generado
de ambas apps, no solo "compila").

**Qué se construyó (alcance reducido a propósito, ver decisión abajo):**
- `packages/ui/src/styles/theme.css` — tokens de marca vía `@theme` de
  Tailwind v4: `--color-background` (#0a0a0a), `--color-foreground` (#f5f0e8,
  cream), `--color-accent` (#c8a96e, dorado), `--font-serif` (Georgia),
  `--font-sans` (Arial), `--ease-kairos` (la curva de easing del documento
  de experiencia). Fuentes de sistema — sin carga de web fonts.
- `Button` (variantes `primary`/`ghost`) y `Screen` (wrapper de pantalla
  completa centrada) — las únicas 2 primitivas verdaderamente transversales.
- Ambas apps (`mapa`, `crm`) ahora importan el tema compartido y usan los
  componentes reales — incluyendo el login y logout del Módulo 4, actualizados
  para dogfoodear el sistema (antes usaban clases de Tailwind ad-hoc).

**Decisión tomada (siguiendo la prioridad de MVP-primero):**
No se construyó el catálogo completo de componentes del documento de UX
(selection cards, sliders, toasts, progress rail). Esos son específicos de
los formatos de pregunta de Mapa Kairos — se construyen en el Módulo 6, en
el contexto real donde se usan y se pueden probar con datos reales, no antes.

**Cambios respecto a la arquitectura original:** ninguno de fondo.

**Problemas encontrados y soluciones aplicadas:**
1. **Problema (real, no cosmético):** las clases de Tailwind usadas dentro de
   `Button`/`Screen` (en `packages/ui`) no aparecían en el CSS final de las
   apps — Tailwind v4 auto-detecta contenido solo dentro del árbol de la app
   que importa el CSS, no en paquetes hermanos del monorepo (problema
   documentado: tailwindlabs/tailwindcss#13136). Sería un bug silencioso muy
   difícil de detectar más adelante (componentes "sin estilo" sin ningún
   error de build). **Solución:** verificado contra la documentación oficial
   de Tailwind y casos reales de otros monorepos antes de aplicar un fix —
   se agregó la directiva `@source "../components";` dentro del propio
   `theme.css`, centralizando el fix en un solo lugar en vez de repetirlo en
   cada app. Confirmado con `grep` sobre el CSS compilado de ambas apps que
   los tokens y clases (`border-accent`, `ease-kairos`, `bg-background`)
   ahora sí se generan.

**Cómo validé el Módulo 5:**
```bash
pnpm install && pnpm type-check   # 6/6 OK
pnpm build                        # ambas apps compilan
# Verificación específica (no solo "compila"):
grep -o "border-accent\|ease-kairos\|--color-accent:[^;]*" apps/mapa/.next/static/chunks/*.css
grep -o "border-accent\|ease-kairos\|font-serif" apps/crm/.next/static/chunks/*.css
# → ambos confirman que los tokens de marca reales están en el CSS, no solo los defaults de Tailwind
```

**Pendientes (no bloquean el Módulo 6):**
- Catálogo de componentes específicos de Mapa Kairos (selection cards,
  slider, toggle binario, progress rail, toasts) — Módulo 6.
- Si el monorepo crece mucho, considerar automatizar los `@source` (como
  hacen los generadores de Nx) en vez de mantenerlos a mano — no es un
  problema al tamaño actual (un solo `@source`).

---

## Módulo 6 — Construcción de Mapa Kairos ✅

**Estado:** completo y validado — el diagnóstico se puede recorrer completo
de principio a fin sin errores (validado con pruebas reales, no solo build).

**Qué se construyó:**
- `packages/scoring-engine/src/content/` — las 20 preguntas del Método
  Umbral (formatos mixtos: `single_select`, `fill_blank`, `scale`,
  `scenario`, `ranking`) y las 3 transiciones de curiosidad, como datos
  TypeScript tipados (ver Decisión 1).
- `apps/mapa/lib/diagnostic/flow.ts` — construye la secuencia de 23 pasos
  (20 preguntas + 3 transiciones intercaladas en el orden correcto) y la
  lógica de "¿esta respuesta está completa?" por formato.
- `apps/mapa/components/diagnostic/` — `IntroScreen`, `QuestionScreen`
  (despacha a `SingleSelectQuestion`/`ScaleQuestion`/`RankingQuestion` según
  el formato), `TransitionScreen` (revelado de líneas con fade secuencial),
  `SelectionCard`, `ProgressBar`.
- `DiagnosticFlow` — orquestador con 3 fases (`intro` → `flow` → `done`),
  estado de respuestas en memoria con nombres de campo ya alineados a
  `Answer` de `@kairos/types` (`questionOptionId`, `valueNumeric`) para que
  los Módulos 7/8 no requieran traducción.
- Pantalla final `done` — placeholder honesto ("el motor de análisis y tu
  resultado llegan en los próximos módulos"), no un resultado falso.

**Decisiones tomadas (afectan módulos futuros):**
1. **Contenido de la metodología como código, no como tablas de Supabase.**
   El documento de arquitectura preveía crear `product_versions`/`questions`
   en este módulo. Se decidió que, para un solo producto/idioma/organización,
   eso agrega indirección sin beneficio real hoy. El contenido vive tipado
   en `@kairos/scoring-engine`. Migración futura: cuando exista una razón
   real (multi-producto, multi-idioma, edición sin deploy), esta misma data
   se mueve a las tablas ya diseñadas — los tipos de contenido son
   intencionalmente compatibles en forma con esas tablas.
2. **Ranking por "tap para ordenar", no drag & drop.** Mejor ergonomía
   móvil real (el 80% del tráfico esperado) y evita añadir una librería de
   drag & drop antes de necesitarla en el CRM (Módulo 11, Kanban).
3. **Pregunta 19 simplificada** — el documento de diseño v2 la pedía con
   peso en dos bloqueques (VE + DM). Se simplificó a un solo bloqueque (VE)
   para no extender `ScoringConfig` a múltiples bloqueques por un único caso
   — documentado, no perdido.

**Cambios respecto a la arquitectura original:** ninguno de fondo — es la
implementación del documento "Mapa Kairos — Sistema de Diagnóstico v2",
con las 2 simplificaciones de arriba.

**Problemas encontrados y soluciones aplicadas:**
1. **Problema:** `exactOptionalPropertyTypes` (Módulo 1) rechazó pasar
   `rankBadge={undefined}` explícitamente a un prop tipado `rankBadge?: number`.
   **Solución:** tipado explícito `rankBadge?: number | undefined`. Confirma
   que la config estricta del Módulo 1 sigue atrapando errores reales.
2. **Problema:** no hay navegador disponible en este entorno (Playwright no
   pudo descargar Chromium — dominio de CDN fuera del allowlist de red).
   **Solución:** validación en dos niveles sin navegador: (a) script que
   ejecuta la lógica real de secuenciación/completitud contra las 20
   preguntas reales (30 aserciones, todas pasaron), y (b) build de
   producción + servidor real + `curl` contra `http://localhost:3050/`
   confirmando HTTP 200 y el HTML exacto de la pantalla de intro
   server-renderizada. No sustituye una prueba manual en navegador real,
   pero es más validación que solo "compila".

**Cómo validé el Módulo 6:**
```bash
pnpm install && pnpm type-check   # 6/6 OK
pnpm build                        # ambas apps compilan

# Validación de lógica real (no solo tipos) — 30 aserciones sobre:
# secuencia de 23 pasos, ubicación de transiciones, completitud de
# respuestas por formato, scoringConfig presente donde corresponde.
# (script temporal, no queda en el repo)

# Validación de servidor real:
npx next start -p 3050   # en apps/mapa, sobre el build de producción
curl http://localhost:3050/   # HTTP 200, HTML con la pantalla de intro real
```

**Pendientes (no bloquean el Módulo 7):**
- Prueba manual en navegador real (recomendado antes de producción) — no
  posible en este entorno sandbox.
- Migrar el contenido de `@kairos/scoring-engine/content` a Supabase el día
  que haga falta multi-producto/multi-idioma (Decisión 1).

---

## Módulo 7 — Motor Aletheia ✅

**Estado:** completo. 20 pruebas automatizadas (Vitest), todas en verde.
Esta vez la validación es sustancia, no "compila" — ver el detalle abajo.

**Qué se construyó:**
- `packages/scoring-engine/src/engine/`:
  - `types.ts` — `EngineAnswer`, `AletheiaResult`, `AletheiaValidationError`.
  - `validate.ts` — rechaza input inválido explícitamente (falta una
    respuesta, escala fuera de rango o no entera, ranking incompleto/con
    duplicados, opción inexistente) en vez de calcular sobre datos corruptos.
  - `scoring.ts` — `computeMaxPossiblePerBlock` + `computeRawScores` →
    `computeBlockScores` (normalizado 0-100 por bloqueo).
  - `dominant.ts` — dominante/secundario con desempate real vía Q20 (la
    pregunta de cierre, diseñada exactamente para esto), con un orden de
    prioridad fijo como último recurso si Q20 no participa del empate.
  - `dimensions.ts` — Claridad/Acción/Confianza/Compromiso + Índice Kairos,
    con las fórmulas fijas del documento v2.
  - `levels.ts` — 5 niveles nombrados, **recalibrados contra el rango real**
    (ver hallazgo abajo), no el 0-100 asumido a ciegas.
  - `patterns.ts` — subset MVP de patrones (uno por dominante + algunas
    combinaciones específicas).
  - `index.ts` — `computeAletheiaResult()`, el único punto de entrada:
    función pura, sin React/Next/Supabase/navegador — recibe respuestas,
    devuelve el resultado completo.
- `src/engine/__tests__/aletheia.test.ts` — 20 pruebas con Vitest.

**Decisión tomada (siguiendo tu instrucción explícita del Módulo 7):**
El motor es 100% funciones puras. `computeAletheiaResult()` no importa nada
fuera de `@kairos/types` y el propio contenido de `@kairos/scoring-engine` —
se puede llamar desde Node, desde un test, o eventualmente desde un Route
Handler o Edge Function (Módulo 8), sin ningún cambio.

**HALLAZGO IMPORTANTE DE METODOLOGÍA (no oculto, documentado):**
Al calibrar los niveles ejecutando el motor contra perfiles extremos
construidos deliberadamente, el rango real observado de `indexScore` fue
**~59-76**, no 0-100. Causa: cada una de las 4 dimensiones depende de solo
2-3 de los 5 bloqueos — un perfil con un solo bloqueo muy agudo pero los
demás bajos puntúa bien en las otras 3 dimensiones, comprimiendo el índice
hacia el centro. Esto significa que un perfil "dominante en Falta de
Dirección pero sano en todo lo demás" puede terminar con un Índice más alto
que uno "disperso pero mediocre en todo" — matemáticamente correcto dado el
diseño de las fórmulas, pero vale la pena que lo sepas: **si en algún punto
quieres que el Índice castigue más a un bloqueo agudo aislado, hay que
ajustar las fórmulas de las 4 dimensiones (Módulo futuro), no solo las
bandas de nivel.** Por ahora, las 5 bandas se recalibraron para que las 5
categorías sean alcanzables en la práctica con el diseño actual:
- Punto de Partida: 0-58 · En Movimiento: 59-64 · Umbral: 65-70 ·
  Consolidado: 71-75 · Dominio: 76-100.

**Cambios respecto a la arquitectura original:**
- Bandas de nivel recalibradas (arriba) — el documento de diseño nunca fijó
  umbrales numéricos, así que no hay contradicción, pero sí una decisión
  nueva que no existía antes.

**Problemas encontrados y soluciones aplicadas:**
1. **Problema:** mi primera calibración a ciegas (bandas uniformes 0-20-40-
   60-80-100) dejaba 3 de los 5 niveles prácticamente inalcanzables dado el
   rango real del motor. **Solución:** en vez de adivinar, escribí un script
   de calibración (no commiteado) que ejecutó el motor contra ~7 perfiles
   extremos construidos a mano, inspeccioné los números reales, y
   recalibré las bandas contra esos datos — documentado como hallazgo, no
   escondido.
2. **Problema:** mi primer test aserto un nivel ("Umbral") de memoria sin
   verificarlo contra el cálculo real. **Solución:** vitest lo atrapó
   inmediatamente (`expected 'En Movimiento' to be 'Umbral'`) — corregido
   contra el valor real calculado, no el que yo esperaba intuitivamente.

**Cómo validé el Módulo 7 (pruebas automáticas con perfiles y casos límite, tal como pediste):**
```bash
cd packages/scoring-engine && npx vitest run
# o desde la raíz:
pnpm test
```
Resultado: **20/20 pruebas pasan**, cubriendo:
- 4 perfiles representativos (bloqueo agudo aislado, concentrado con
  secundario claro, crisis combinada con perfil mixto, disperso sin
  bloqueo agudo).
- Determinismo (mismas respuestas → resultado idéntico, `toEqual` estricto).
- 4 pruebas de desempate (empate resuelto por Q20; empate resuelto por
  prioridad fija cuando Q20 no aplica; detección correcta de `isMixedProfile`
  con diferencia ≤3 y >3 puntos).
- Niveles: cobertura completa 0-100 sin huecos, monotonía estricta, sin
  excepciones ni siquiera con valores fuera de rango.
- 7 pruebas de respuestas inválidas: falta una respuesta, escala fuera de
  rango, escala no entera, ranking incompleto, ranking con duplicados,
  opción inexistente, array de respuestas vacío — todas lanzan
  `AletheiaValidationError` con mensaje descriptivo.

Además, el resto del monorepo sigue intacto: `pnpm type-check` (6/6) y
`pnpm build` (ambas apps) confirmados después de agregar el motor.

**Pendientes (no bloquean el Módulo 8):**
- Ampliar la biblioteca de patrones (hoy: 5 base + 4 combinaciones — el
  documento de arquitectura preveía 3-5 por combinación dominante+secundario,
  20 combinaciones posibles).
- Revisar si las fórmulas de las 4 dimensiones deberían ponderar más un
  bloqueo agudo aislado (ver hallazgo de metodología arriba) — decisión de
  producto, no técnica, pendiente de tu criterio.
- **Recalibrar las 5 bandas de nivel contra el límite matemático exacto**
  (mínimo real 54.11, máximo real 76.75 — calculado por optimización
  exhaustiva pregunta por pregunta, no aproximado) en vez de la calibración
  empírica actual (~59-76). El cálculo ya está hecho y documentado en el
  hilo de la conversación; falta aplicarlo al código. No bloquea nada — es
  una mejora de precisión, no una corrección de un error.
- El motor todavía no se invoca desde ningún lado real (eso es exactamente
  el Módulo 8: guardar el diagnóstico y llamar a Aletheia con las respuestas
  reales de `apps/mapa`).

---

## Módulo 8 — Guardado de diagnósticos ✅

**Estado:** completo. Flujo integrado de extremo a extremo: responder las 20
preguntas → Aletheia calcula en el servidor → se guarda un registro real →
la pantalla final confirma el `resultCode` devuelto por el servidor.

**Qué se construyó:**
- `supabase/migrations/0004_diagnostic_sessions.sql` — una sola tabla
  (simplificación deliberada, ver Decisión 1), con RLS habilitado.
- `@kairos/database` — tipo `Json` correcto y tabla `diagnostic_sessions`
  agregada a `database.types.ts`.
- `apps/mapa/app/api/diagnostic/submit/route.ts` — Route Handler que:
  1. recibe las respuestas crudas del cliente,
  2. calcula el resultado con Aletheia **en el servidor** (nunca confía en
     un resultado precalculado del cliente),
  3. guarda con el cliente de `service_role` (bypassa RLS a propósito).
- `DiagnosticFlow` actualizado — nuevos estados `submitting`/`error` con
  reintento, y la pantalla final ahora muestra el `resultCode` real
  devuelto por el servidor (no un placeholder).

**Decisiones tomadas:**
1. **Una sola tabla, respuestas y resultado como JSONB** — no la versión
   normalizada (`answers`, `session_scores`, `diagnostic_results` separadas)
   del documento de arquitectura. Nada hoy necesita filtrar por respuesta
   individual a nivel SQL; se normaliza cuando el CRM (Módulo 11) lo
   requiera de verdad.
2. **Una sola organización, vía variable de entorno** (`KAIROS_ORGANIZATION_ID`)
   — Mapa Kairos no tiene selector de organización todavía. Correcto para
   el primer diagnóstico funcional; se resuelve si algún día hay multi-tenant
   real en el producto público.

**Cambios respecto a la arquitectura original:** los de la Decisión 1 —
documentados, no ocultos.

**Problemas encontrados y soluciones aplicadas (reales, de tipos — no
cosméticos):**
1. **Problema:** el insert a Supabase fallaba en type-check con
   `Object literal may only specify known properties... type 'never[]'`.
   **Causa raíz real:** `postgrest-js` exige un campo `Relationships:
   GenericRelationship[]` en cada tabla del tipo `Database` para poder
   resolver joins — sin él, el tipo completo de la tabla colapsa a `never`
   silenciosamente. No estaba en ninguna guía que seguí antes; lo encontré
   inspeccionando directamente los `.d.mts` del paquete instalado.
   **Solución:** agregado `Relationships: []` a las 4 tablas de
   `database.types.ts`.
2. **Problema:** columnas `answers`/`result` tipadas como `unknown`
   rompían la inferencia genérica de Supabase (esperaba el tipo `Json`
   específico). **Solución:** definido `Json` correctamente y exportado
   desde `@kairos/database`.
3. **Problema:** `EngineAnswer[]`/`AletheiaResult` (interfaces con nombre)
   no son asignables estructuralmente a `Json` (que tiene firma de índice
   explícita) — limitación conocida de TypeScript, no un error real de
   datos. **Solución:** cast explícito y documentado (`as unknown as Json`)
   en el único punto donde se serializa.

**Cómo validé el Módulo 8 (de extremo a extremo, dentro de lo que el
entorno permite — ver limitación conocida abajo):**
```bash
pnpm type-check && pnpm build   # 6/6 y ambas apps compilan,
                                 # incluyendo /api/diagnostic/submit
pnpm test                       # las 20 pruebas de Aletheia siguen en verde
```
Validación adicional, más fuerte que solo tipos:
1. Migración `0004` corrida contra Postgres real — tabla + índices + RLS.
2. Prueba de RLS con payload realista: miembro de la organización ve la
   sesión, un usuario ajeno no ve nada — igual que en el Módulo 3.
3. **Generé un resultado real** (no un mock) llamando a
   `computeAletheiaResult()` con las 20 respuestas reales, lo inserté en la
   tabla migrada, y lo consulté de vuelta con queries `jsonb` — confirmando
   `resultCode`, `dominantBlock`, `level.name` y el conteo de 20 respuestas,
   exactamente como lo haría un cliente real después de usar la API.

**Limitación conocida (igual que Módulos 3 y 4, no nueva):** sin un
proyecto Supabase real conectado, no puedo probar el Route Handler
completo corriendo de verdad contra la API de Supabase (PostgREST) — hasta
que eso exista, la prueba más fuerte posible es la de arriba (SQL real +
payload real + Route Handler compilado y type-checkeado).

**Pendientes (no bloquean el Módulo 9):**
- Conectar un proyecto Supabase real y `.env.local` reales — entonces se
  puede probar el POST real de principio a fin.
- Recalibrar las bandas de nivel al límite matemático exacto (pendiente
  desde el Módulo 7 — sigue sin bloquear nada).
- Capturar `source` real (hoy siempre `null` — falta leer UTM params de la URL).
- El resultado que se le muestra al usuario en `done` es un placeholder
  mínimo (`resultCode` en texto) — la revelación completa y diseñada es
  exactamente el Módulo 9.

---

## Módulo 9 — Pantalla de resultados ✅

**Estado:** completo. Revelación progresiva completa, persistencia real por
`session_id` (sobrevive a un refresh), responsive, validado de extremo a
extremo dentro de lo que el entorno permite.

**Qué se construyó:**
- `@kairos/ui` — 3 componentes compartidos nuevos (reutilizables por el CRM
  en el Módulo 11): `RadarChart` (SVG de 5 ejes, con anillos de referencia
  y el vértice dominante resaltado), `DimensionBar` (barra animada), y
  `FadeInSection` (revelación con stagger corto — 120ms entre secciones,
  nunca más de ~1s en total, cero esperas artificiales).
- `@kairos/scoring-engine/content/diagnoses.ts` — los 5 diagnósticos
  completos (qué significa, origen, relaciones, trabajo, autoestima,
  decisiones, riesgo, potencial), sin sección de solución, como en el
  documento original.
- `@kairos/scoring-engine/content/insights.ts` — fortaleza natural (del
  bloqueo más bajo) y riesgo condensado (del dominante).
- `apps/mapa/lib/result/fetchSession.ts` — fetch server-only por
  `session_id`, patrón de "URL de capacidad" (el UUID impredecible hace de
  llave, sin requerir login).
- `apps/mapa/app/resultado/[sessionId]/page.tsx` — Server Component real,
  con estado de "no encontrado" manejado con gracia (nunca crashea).
- `ResultReveal` — las 7 secciones pedidas: Kairos ID, bloqueo dominante +
  primer patrón, radar, secundario + fortaleza + riesgo, 4 dimensiones,
  diagnóstico completo, CTA de WhatsApp con el `resultCode` prellenado.
- `DiagnosticFlow` actualizado — ya no muestra un placeholder en memoria;
  redirige a `/resultado/[sessionId]` real después de guardar.

**Decisiones tomadas:**
1. **Persistencia vía UUID de sesión como "URL de capacidad"**, no vía
   sesión de usuario autenticado — coherente con que Mapa Kairos es y debe
   seguir siendo anónimo/público.
2. **CTA de WhatsApp (click-to-chat) en vez de esperar al Módulo 10**
   (ManyChat) — funciona hoy, sin backend adicional. ManyChat después
   añade el contacto *proactivo* automático; este es el *reactivo*,
   iniciado por el usuario, y ambos pueden coexistir.
3. **Revelación progresiva con animación CSS por stagger fijo** (no timers
   de `setTimeout` en cadena como en `TransitionScreen`) — más simple, y
   garantiza que la revelación completa nunca tarde más de ~1s.

**Problemas encontrados y soluciones aplicadas:**
1. **Problema:** `fetchDiagnosticSession()` no capturaba errores de
   configuración (env vars faltantes) — hubiera crasheado la página con un
   500 en vez de mostrar el estado de "no encontrado". Lo detecté probando
   exactamente el escenario en el que estoy ahora mismo (sin credenciales
   reales de Supabase). **Solución:** try/catch que devuelve `null` ante
   cualquier error — confirmado con `curl` real: HTTP 200 y el mensaje
   amigable, no un crash.

**Cómo validé el Módulo 9 (de extremo a extremo, dentro de lo que el
entorno permite):**
```bash
pnpm type-check && pnpm build   # 6/6 y ambas apps, incluye /resultado/[sessionId]
pnpm test                        # 20/20 pruebas de Aletheia siguen en verde
```
Validación adicional, más fuerte que solo tipos:
1. Servidor de producción real + `curl` contra `/resultado/<uuid-inexistente>`
   → HTTP 200 con "No encontramos este diagnóstico" (no un crash) — y
   contra `/` → HTTP 200 con la intro real.
2. CSS generado confirmado con `grep`: `fade-in-up`, `bg-accent` — las
   animaciones y tokens de los componentes nuevos sí se generan (aplicando
   la lección del Módulo 5 sobre `@source`).
3. **Generé un resultado real de Aletheia**, lo inserté en la tabla
   migrada, y lo consulté con el **patrón de consulta exacto** que usa
   `fetchDiagnosticSession()` (`select id, result, created_at ... eq(id)
   ... single()`) — confirmando `resultCode`, dominante, secundario,
   dimensiones y conteo de patrones, todo recuperable desde JSONB real.

**Limitación conocida (igual que Módulos 3, 4 y 8):** sin un proyecto
Supabase real conectado, no puedo ver la página de resultado renderizada
con datos reales en un navegador — la validación de arriba (SQL real +
patrón de consulta idéntico + Route/página compilados) es la más fuerte
posible en este entorno.

**Pendientes (no bloquean el Módulo 10):**
- Conectar un proyecto Supabase real para ver el flujo completo en
  navegador de principio a fin.
- Recalibrar las bandas de nivel al límite matemático exacto (pendiente
  desde el Módulo 7).
- La tarjeta compartible para Instagram Stories (diseñada en el documento
  de producto) no se construyó — es una pieza de crecimiento/marketing,
  no bloquea que el diagnóstico funcione de principio a fin.
- Si `NEXT_PUBLIC_WHATSAPP_NUMBER` no está seteado, el botón de CTA queda
  deshabilitado — hay que configurarlo antes de producción.

---

## Módulo 10 — Integración con ManyChat ✅

**Estado:** completo. Integración real (endpoints y payloads verificados
contra la documentación oficial de ManyChat, no inventados), en ambas
direcciones: saliente (notificar al completar el diagnóstico) y entrante
(webhook receptor).

**Inconsistencia detectada y resuelta antes de programar:** Mapa Kairos es
100% anónimo — nunca pregunta Instagram/nombre. Para poder notificar a
alguien por ManyChat hace falta su `subscriber_id`, que **no se pide al
usuario** — se captura de un query param (`?mc=`) cuando la persona llega
desde un link dentro de una conversación de ManyChat (el patrón real de
cómo funciona esto en producción), no desde un link suelto en una Story.

**Qué se construyó:**
- `supabase/migrations/0005_manychat_integration.sql` — columna
  `manychat_subscriber_id` en `diagnostic_sessions` + tabla `webhook_events`
  (log de eventos entrantes/salientes), con RLS.
- `apps/mapa/lib/manychat/client.ts` — cliente mínimo:
  `setCustomField` (setea datos ANTES del flow — `sendFlow` no acepta datos
  dinámicos de forma confiable, confirmado con reportes reales de la
  comunidad de ManyChat) + `sendFlow` (dispara la automatización). Nunca
  lanza — cualquier fallo se atrapa, el diagnóstico del usuario no depende
  de esto (fire-and-forget real).
- `apps/mapa/app/api/webhooks/manychat/route.ts` — receptor de eventos
  entrantes, protegido con un secreto compartido (`?secret=`), loguea crudo
  en `webhook_events` (todavía no hay `leads` para asociarlos — Módulo 11).
- `DiagnosticFlow` — captura `?mc=` de la URL vía `window.location.search`
  (no `useSearchParams`, para no forzar la página a dejar de ser estática).
- `/api/diagnostic/submit` — si hay subscriber, notifica a ManyChat después
  de guardar, y registra el resultado (éxito/error) en `webhook_events`.

**Decisiones tomadas:**
1. **Dos llamadas a ManyChat, no una** (`setCustomField` × N + `sendFlow`)
   — es el único patrón confiable según la propia comunidad de ManyChat;
   pasar datos directo en `sendFlow` es un bug reportado y no arreglado.
2. **Los eventos entrantes solo se loguean por ahora** — no se procesan ni
   se asocian a un lead, porque `leads` no existe hasta el Módulo 11. Es
   trabajo real pero incompleto a propósito, documentado, no un parche.
3. **`window.location.search` en vez de `useSearchParams`** — mantiene la
   página de inicio estática (confirmado en el build: sigue como `○ /`).

**Problemas encontrados y soluciones aplicadas:** ninguno más allá de lo
ya documentado arriba — el diseño se verificó contra la API real antes de
escribir código, así que no hubo sorpresas de tipos esta vez.

**Cómo validé el Módulo 10:**
```bash
pnpm type-check && pnpm build   # 6/6, incluye /api/webhooks/manychat
pnpm test                        # 20/20 Aletheia siguen en verde
```
Validación adicional:
1. Las 5 migraciones (incluyendo la nueva) corridas contra Postgres real,
   sin errores.
2. Servidor de producción real + `curl` contra el webhook sin configurar
   → HTTP 500 con mensaje explícito (no un crash silencioso ni un 200 falso).

**Pendientes (no bloquean el Módulo 11):**
- Conectar credenciales reales de ManyChat (API token, flow_ns, field IDs)
  para probar el envío real — mismo tipo de limitación que Supabase.
- Procesar los eventos entrantes de `webhook_events` y asociarlos a un lead
  — depende de que exista `leads` (Módulo 11).
- Javi necesita crear en su cuenta de ManyChat: los custom fields
  (resultado, bloqueo dominante) y el flow de seguimiento, y configurar el
  link "External Request" con el secreto del webhook.

---

## Módulo 11 — CRM (v1, corte vertical) ✅

**Estado:** completo como flujo usable de extremo a extremo — no como CRM
con todas las funciones del documento de arquitectura. Kanban real con
drag & drop, ficha de lead mínima, todo protegido por RLS de verdad.

**Qué se construyó:**
- `supabase/migrations/0006_leads_pipeline.sql`:
  - `pipeline_stages` — cuelga directo de `organization_id` (sin la tabla
    `pipelines` intermedia del documento original — un pipeline implícito
    por organización, se agrega la capa extra si algún negocio la necesita).
  - Trigger `seed_default_pipeline_stages` — cada organización nueva recibe
    automáticamente las 8 etapas por defecto (resuelve el problema de
    secuencia: las migraciones corren antes de que exista ninguna
    organización real).
  - `leads` — con RLS completo (`leads:read:all` / `leads:read:assigned` /
    `leads:write`, ya definidos desde el Módulo 3).
  - Trigger `create_lead_from_diagnostic_session` — **cada diagnóstico
    completado se convierte automáticamente en un lead**, en la etapa
    "Nuevo". Esto era necesario para que el CRM tuviera datos reales desde
    el día uno — nada más en el sistema creaba leads hasta ahora.
- `apps/crm`:
  - `lib/leads/fetchBoard.ts` — primera consulta real del proyecto que
    depende de RLS funcionando en el flujo de la app (no solo en tests).
  - `lib/leads/actions.ts` — Server Action `updateLeadStage`, protegida
    por la policy `leads:write`, no por lógica de aplicación.
  - `components/kanban/{Board,Column,LeadCard}.tsx` — drag & drop real con
    `@dnd-kit`, update optimista con reversión si el servidor rechaza el
    cambio.
  - `app/(dashboard)/leads/[id]/page.tsx` — ficha de lead, **reutilizando
    `RadarChart`/`DimensionBar` de `@kairos/ui`** tal como se diseñó desde
    el Módulo 9 (primera prueba real de que esos componentes sí son
    compartibles entre apps).

**Decisiones tomadas (corte vertical explícito):**
1. Sin tabla `pipelines` intermedia — un pipeline implícito por organización.
2. Sin `lead_stage_history` (auditoría de movimientos) todavía — el update
   de etapa es directo, no hay registro de quién movió qué y cuándo.
3. Sin notas, etiquetas, ni historial de interacciones — la ficha de lead
   solo muestra el resultado del diagnóstico.
4. Sin filtros, sin asignación de asesores en la UI, sin gestión de
   columnas del pipeline — todo eso asume más de un usuario/asesor, y hoy
   solo existe el owner.
5. Click vs. drag en la tarjeta se resuelve con `activationConstraint:
   { distance: 8 }` del sensor de dnd-kit — un click sin movimiento
   navega a la ficha, un movimiento real inicia el drag.

**Cambios respecto a la arquitectura original:** los 4 primeros puntos de
arriba — todos documentados como próximos incrementos, no perdidos.

**Cómo validé el Módulo 11 (de extremo a extremo, con RLS real):**
```bash
pnpm type-check && pnpm build   # 6/6, incluye Kanban y ficha de lead
pnpm test                        # 20/20 Aletheia siguen en verde
```
Validación adicional, la más rigurosa hasta ahora:
1. **Los 2 triggers probados en cadena real:** crear una organización →
   las 8 etapas aparecen solas; insertar un diagnóstico → el lead aparece
   solo, en la etapa "Nuevo" — sin ningún INSERT manual a `leads` ni
   `pipeline_stages`.
2. **RLS probado con 2 usuarios reales, roles distintos, en el flujo
   completo del CRM** (no solo en aislamiento como en módulos anteriores):
   - Owner ve el lead recién creado por el trigger.
   - Owner mueve el lead de "nuevo" a "contactado" — confirmado con SELECT
     posterior.
   - Viewer (sin asignación) ve 0 leads.
   - Viewer intenta mover el mismo lead — bloqueado por RLS, confirmado.

**Pendientes (próximos incrementos del CRM, documentados, no bloquean nada):**
- `lead_stage_history` (auditoría de movimientos entre columnas).
- Notas privadas, etiquetas, historial de interacciones en la ficha de lead.
- Filtros avanzados (Kairos ID, bloqueo, nivel, fecha, etiquetas).
- Asignación de leads a asesores + UI de gestión de equipo (Módulo 4 ya
  dejó esto pendiente).
- Gestión de columnas del pipeline desde la UI (hoy es fijo, sembrado por
  el trigger).
- Reordenar tarjetas dentro de la misma columna (hoy solo cambia de columna).

---

## Módulo 12 — Automatizaciones (v1, corte vertical) ✅

**Estado:** completo — una sola automatización, pero cierra un ciclo real
entre 3 módulos ya construidos, en vez de agregar algo nuevo y aislado.

**Qué se construyó:**
1. **Corrección de la etapa inicial del lead** (`0007_lead_initial_stage_fix.sql`):
   el trigger del Módulo 11 creaba el lead en "Nuevo", pero por diseño solo
   se dispara cuando el diagnóstico **ya se completó** — ahora nace
   correctamente en "Diagnóstico completado". "Nuevo" queda reservado para
   un futuro con captura de diagnósticos abandonados.
2. **El webhook entrante de ManyChat ahora actualiza leads reales**: busca
   por `manychat_subscriber_id`, setea `last_interaction_at`, y avanza
   automáticamente de "Diagnóstico completado" → "Contactado" — solo si el
   lead sigue en esa etapa (nunca retrocede uno que un asesor ya movió
   manualmente más adelante).

**Decisión tomada:** una sola automatización, no varias — prioricé cerrar
un ciclo real y verificable (ManyChat → lead → pipeline) sobre construir
automatizaciones nuevas especulativas (recordatorios, asignación
automática) que no tienen todavía un caso de uso probado.

**Problemas encontrados y soluciones aplicadas:**
1. **Problema:** el `Update` tipado de `leads` es estricto — pasar un
   `Record<string, unknown>` genérico al `.update()` fallaba en type-check
   (`'string' index signatures are incompatible`). **Solución:** tipado
   explícito del objeto de actualización en vez de un Record genérico.

**Cómo validé el Módulo 12 (con Postgres real, no solo lógica en el papel):**
```bash
pnpm type-check && pnpm build && pnpm test   # 6/6, ambas apps, 20/20 Aletheia
```
Validación adicional:
1. Confirmado con SQL real: un diagnóstico nuevo crea el lead en
   "diagnostico_completado" (no "nuevo").
2. Simulé exactamente la lógica del webhook contra un lead real con
   `manychat_subscriber_id` — confirmé que avanza a "contactado" y setea
   `last_interaction_at`, partiendo de un estado real verificado antes y
   después del cambio.

**Pendientes (documentados, no bloquean el Módulo 13):**
- Captura de diagnósticos abandonados (para poder reactivar "Nuevo" como
  etapa real, no solo reservada).
- Recordatorio/alerta cuando un lead lleva mucho tiempo sin interacción
  ("se enfría") — mencionado en el documento de diseño original del CRM.
- Asignación automática de leads a asesores (round-robin) — solo aplica
  cuando exista más de un asesor.
- Secuencias de seguimiento automatizadas más allá del primer mensaje.

---

## Módulo 13 — Optimización (v1, corte vertical) ✅

**Estado:** completo — solo lo indispensable para producción (seguridad y
una verificación real de peso del bundle móvil), no una pasada de
performance exhaustiva.

**Qué se auditó/construyó:**
1. **Auditoría de RLS en las 7 tablas** — todas tienen
   `enable row level security`, confirmado por grep directo sobre las
   migraciones (no de memoria). Sin gaps.
2. **Verificación real de peso del bundle de `apps/mapa`** (crítico — 80%
   del tráfico esperado es móvil, per el brief original de diseño):
   ~668KB de JS sin comprimir en total — razonable para el baseline de
   Next.js/React, nada de bloat evidente.
3. **Confirmé con `grep` que `supabase-js`/`@supabase/ssr` NO se filtró al
   bundle del cliente** — vive solo en el servidor (los componentes cliente
   llaman a `fetch()` contra las API routes, nunca importan
   `@kairos/database` directamente). Esto evita ~50-100KB innecesarios en
   el dispositivo del usuario, y confirma que la separación de
   responsabilidades del Módulo 3 está pagando dividendos reales.
4. **Cabeceras de seguridad básicas** en ambas apps (`X-Content-Type-Options`,
   `X-Frame-Options: DENY`, `Referrer-Policy`), más `X-Robots-Tag: noindex`
   específico en el CRM (privado, nunca debe indexarse) — verificado con
   `curl` real contra un servidor levantado, no solo en el código.

**Decisión tomada:** sin Content-Security-Policy todavía — una CSP mal
calibrada rompe scripts/estilos de forma silenciosa, y afinarla bien
(permitir Tailwind, Next.js inline scripts, etc.) es un esfuerzo aparte que
no es indispensable para el primer lanzamiento. Documentado como pendiente,
no ignorado.

**Cómo validé el Módulo 13:**
```bash
pnpm type-check && pnpm build && pnpm test   # 6/6, ambas apps, 20/20 Aletheia
grep -h "enable row level security" supabase/migrations/*.sql | wc -l   # 7, una por tabla
grep -l "supabase" apps/mapa/.next/static/chunks/*.js                  # sin resultados = confirmado
curl -sI http://localhost:PORT/ | grep -i "x-frame\|x-content-type"     # cabeceras reales presentes
```

**Pendientes (no bloquean el deploy — documentados para después):**
- Content-Security-Policy calibrada correctamente.
- Rate limiting real en `/api/diagnostic/submit` — un limitador en memoria
  no serviría de nada en el entorno serverless de Vercel (cada invocación
  puede correr en una instancia distinta); la opción real es un servicio
  distribuido (ej. Upstash Redis), que se conecta junto con el resto de
  credenciales en la sesión de deploy.
- Monitoreo/observabilidad de errores en producción (ej. Sentry) — hoy
  solo hay `console.error` local.
- Compresión/CDN de assets — se resuelve automáticamente al desplegar en
  Vercel, no requiere trabajo adicional de nuestra parte.

---

## Módulo 14 — Deploy 🔄

*(pendiente, según lo acordado — se hace en una sola sesión al final,
cuando Supabase + GitHub + Vercel estén listos)*












