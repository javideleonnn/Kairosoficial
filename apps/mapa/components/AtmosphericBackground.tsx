/**
 * Fondo atmosférico compartido — halos dorados, profundidad, glow suave.
 * El blur vive ÚNICAMENTE aquí (nunca sobre cards ni texto). En el flujo
 * de preguntas se monta una sola vez, como hermano persistente de las
 * pantallas que se remontan por pregunta (ver DiagnosticFlow) — así el
 * blur nunca se recalcula en cada transición, que fue la causa real del
 * lag en una iteración anterior.
 */
export function AtmosphericBackground(): React.JSX.Element {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute -top-48 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent/[0.11] blur-[150px]" />
      <div className="absolute -bottom-56 -right-32 h-[480px] w-[480px] rounded-full bg-accent/[0.07] blur-[170px]" />
      <div className="absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full bg-accent/[0.05] blur-[160px]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(900px circle at 50% 15%, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
