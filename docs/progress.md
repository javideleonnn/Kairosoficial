# Kairos — Progreso del proyecto

**Nota de reconstrucción:** este documento fue reconstruido después de un
reinicio completo del entorno de desarrollo (sandbox) a mitad de un
sprint de rediseño visual. El código fue recreado fielmente a partir del
historial de la conversación (cada archivo fue efectivamente re-escrito,
no aproximado). Esta versión de `progress.md` es una **versión condensada**
del historial completo de decisiones — prioriza que sea exacta sobre que
sea exhaustiva palabra por palabra.

---

## Módulos 1-13 — resumen

1. **Monorepo**: Turborepo + pnpm workspaces. `apps/mapa`, `apps/crm`,
   `packages/{types,database,scoring-engine,ui,config}`. TypeScript
   estricto desde el día uno (`strict`, `noUncheckedIndexedAccess`,
   `exactOptionalPropertyTypes`).
2. **Next.js**: Next 16 (App Router), React 19, Tailwind v4 (CSS-first,
   sin `tailwind.config.js`). Decisión clave: paquetes compartidos sin
   build propio, transpilados vía `transpilePackages`.
3. **Supabase**: 7 migraciones SQL. Todas las tablas con RLS habilitado.
   Auth por invitación (sin signup público). Validado con Postgres real
   en cada módulo (no solo revisión de código).
4. **Autenticación**: login mínimo para un usuario `owner` (CRM), sesión
   validada en `proxy.ts` (antes `middleware.ts` — Next 16 renombró la
   convención). Script `bootstrap-owner.ts` para crear el primer usuario
   (signup deshabilitado a propósito).
5. **Sistema de diseño compartido**: tokens de marca (`--color-background:
   #0a0a0a`, `--color-foreground: #f5f0e8`, `--color-accent: #c8a96e`,
   `--font-serif: Georgia`, `--font-sans: Arial`) vía `@theme` de Tailwind
   v4 en `packages/ui/src/styles/theme.css`. Componentes: `Button`,
   `Screen`, `FadeInSection`, `RadarChart`, `DimensionBar`.
6. **Mapa Kairos**: el flujo de diagnóstico completo (intro → preguntas →
   transiciones → envío). Contenido de la metodología vive como código
   tipado en `@kairos/scoring-engine`, no en tablas de Supabase (decisión
   deliberada: sin necesidad real de contenido dinámico multi-producto
   todavía).
7. **Motor Aletheia**: funciones puras (`computeAletheiaResult`), sin
   dependencias de React/Next/Supabase. Suite de tests con Vitest.
   Desempate vía la pregunta de cierre. Niveles calibrados por
   optimización exhaustiva (no estimados a ciegas).
8. **Guardado de diagnósticos**: Route Handler `/api/diagnostic/submit` —
   Aletheia corre en el servidor, nunca en el cliente. Tabla
   `diagnostic_sessions` (JSONB para respuestas/resultado, simplificación
   deliberada vs. el esquema totalmente normalizado original).
9. **Pantalla de resultados**: revelación progresiva (Kairos ID → radar →
   dimensiones → diagnóstico → CTA), persistencia real vía
   `/resultado/[sessionId]` (URL de capacidad, sin requerir login).
10. **ManyChat**: integración real (verificada contra la API oficial) —
    `setCustomField` + `sendFlow` en dos llamadas (no una, por un bug
    conocido de la plataforma). Webhook entrante con secreto compartido.
11. **CRM v1**: Kanban con `@dnd-kit`, triggers de Postgres que crean
    leads automáticamente al completar un diagnóstico y siembran el
    pipeline por defecto en cada organización nueva. RLS probado con
    2 roles reales (owner ve/mueve, viewer no puede).
12. **Automatizaciones v1**: corrección de la etapa inicial del lead
    (nace en "Diagnóstico completado", no en "Nuevo"), webhook entrante
    de ManyChat ahora actualiza leads reales (avanza de etapa, marca
    interacción).
13. **Optimización v1**: auditoría de RLS (7/7 tablas cubiertas),
    cabeceras de seguridad, verificación de que `supabase-js` no se
    filtra al bundle del cliente.

---

## Revisión de metodología — 20 → 12 preguntas

Antes de recortar el cuestionario, se construyó un **mapa conceptual**:
20 manifestaciones (4 por bloqueo) + 3 pares de "conducta idéntica, causa
distinta" (dificultad para poner límites: Identidad Débil vs Validación
Externa; acción inconsistente: Falta de Dirección vs Dependencia de la
Motivación; abandona lo empezado: Falta de Dirección vs Autosabotaje). El
cuestionario de 12 preguntas se diseñó desde ese mapa, no por recorte del
de 20 — 3 preguntas de escenario (Q3, Q4, Q5) existen específicamente para
distinguir cada par de confusión.

Efecto secundario positivo: el balance de cobertura por bloqueo mejoró
(antes Falta de Dirección aparecía en 16 de 20 preguntas; ahora la
distribución es mucho más pareja). Pendiente conocido: Identidad Débil
quedó con la cobertura relativa más baja (ninguna pregunta de escenario
la incluye).

Motor actualizado: `CLOSING_QUESTION_ID = "q12"` (antes `"q20"`). Niveles
recalibrados al rango teórico exacto del nuevo cuestionario (mínimo 50.33,
máximo 69.43, calculado por optimización exhaustiva). Suite de tests
reescrita: 24 pruebas (perfiles representativos, determinismo, desempate,
niveles, respuestas inválidas, integridad de contenido).

---

## Rediseño visual (post-metodología)

Sesión de rediseño completo de la experiencia visual (intro, preguntas,
resultado), con ChatGPT como Product Manager definiendo especificaciones
y esta sesión implementándolas. Iteraciones múltiples sobre cada pantalla,
aprobadas una por una. Puntos clave:

- **IntroScreen**: rediseño premium (glassmorphism sutil, fondo con luces
  desenfocadas, animación escalonada). Textos actualizados a los números
  reales ("12 preguntas", "3 minutos" — nunca los del cuestionario viejo).
- **QuestionScreen**: sin botón "Continuar" — avance automático 300ms
  después de responder. Sin "Pregunta X de N" visible. Header con
  wordmark + barra de progreso finísima. Cards rediseñadas como filas con
  radio circle (estilo tomado de una imagen de referencia oficial provista
  por el usuario), reemplazando el glassmorphism con blur anterior.
- **Optimización de rendimiento en móvil (hallazgo real, no supuesto)**:
  el fondo con blur de la pantalla de preguntas se recalculaba en cada
  remount (cada pregunta, ~300-550ms) porque vivía dentro de
  `QuestionScreen`, que se remonta completo por pregunta. Se movió a
  `DiagnosticFlow` (contenedor persistente, nunca se remonta). Además, se
  eliminó `backdrop-blur` de las cards de respuesta (hasta 5 por
  pregunta, animándose con stagger) — backdrop-filter es una de las
  propiedades más costosas en móvil. El nuevo estilo de fila con borde
  sólido (inspirado en la imagen de referencia) logra el mismo nivel
  visual sin ese costo.
- **ResultReveal**: arquitectura de 8 pasos aprobada explícitamente:
  bloqueo dominante (sin mostrar el secundario, decisión deliberada) →
  radar (el elemento más prominente, con glow atmosférico propio) → 5
  barras de bloqueo (nombres completos, sin siglas, sin porcentajes, la
  dominante en dorado) → párrafo único (máx. 4 líneas, `line-clamp-4`) →
  "Tu siguiente paso" → espacio reservado para VSL (no implementado,
  invisible hasta que exista una URL real) → CTA (pill sólido dorado,
  estilo de la imagen de referencia) → cierre elegante (una frase, sin
  botón). Regla dura mantenida en todo el rediseño: **nunca mostrar las
  siglas FD/IDE/DM/AS/VE al usuario final** — siempre nombre completo
  (`BLOCK_NAMES`).
- **Reglas de scope respetadas durante todo el rediseño**: sin
  funcionalidades nuevas (se descartaron explícitamente el botón de
  descarga y la sección "Ruta de 30 días" de la imagen de referencia, por
  no existir en el producto real), sin cambios a la lógica del
  diagnóstico ni al motor de scoring.

---

## Pendientes conocidos (no bloquean nada, documentados)

- Módulo 14 (Deploy) — proyecto Supabase real ya creado, pendiente
  completar variables de entorno de producción y conectar Vercel/GitHub.
- Identidad Débil con cobertura relativa más baja en el cuestionario de 12.
- `lead_stage_history` (auditoría de movimientos), notas, etiquetas,
  filtros avanzados, asignación de asesores — capacidades de CRM
  diferidas a incrementos futuros.
- Rate limiting real en `/api/diagnostic/submit` (requiere un servicio
  distribuido tipo Upstash — un limitador en memoria no serviría en
  Vercel serverless).
- Content-Security-Policy calibrada, monitoreo de errores en producción.
- Rotación del copy "Reflexiona" (hoy estático en las 12 preguntas) —
  señalado en la auditoría UX, deliberadamente pospuesto.
