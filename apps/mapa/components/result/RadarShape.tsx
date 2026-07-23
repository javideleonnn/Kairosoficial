interface RadarDatum {
  key: string;
  label: string;
  value: number;
}

interface RadarShapeProps {
  data: RadarDatum[];
  highlightKey: string;
}

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = 128;
const LABEL_RADIUS = RADIUS + 62;

function pointAt(angleDeg: number, distance: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + distance * Math.cos(angleRad), y: CENTER + distance * Math.sin(angleRad) };
}

// Estrellas de fondo fijas (deterministas, no aleatorias en cada render)
const BACKGROUND_STARS: Array<{ x: number; y: number; r: number; o: number }> = [
  { x: 40, y: 60, r: 1, o: 0.5 }, { x: 360, y: 50, r: 1.2, o: 0.4 },
  { x: 30, y: 340, r: 0.8, o: 0.45 }, { x: 370, y: 320, r: 1, o: 0.4 },
  { x: 200, y: 20, r: 1, o: 0.5 }, { x: 200, y: 385, r: 0.9, o: 0.4 },
  { x: 80, y: 180, r: 0.7, o: 0.35 }, { x: 320, y: 200, r: 0.9, o: 0.4 },
  { x: 130, y: 350, r: 0.7, o: 0.3 }, { x: 270, y: 45, r: 0.8, o: 0.35 },
  { x: 55, y: 250, r: 0.6, o: 0.3 }, { x: 340, y: 150, r: 0.7, o: 0.35 },
];

/**
 * Radar tipo constelación — estrellas de fondo, nodos que brillan (capas
 * sólidas superpuestas, sin filter:blur), líneas finas conectando cada
 * punto como una figura estelar. Nombre completo + valor en cada eje.
 */
export function RadarShape({ data, highlightKey }: RadarShapeProps): React.JSX.Element {
  const n = data.length;
  const angleStep = 360 / n;
  const axisPoints = data.map((_, i) => pointAt(i * angleStep, RADIUS));
  const dataPoints = data.map((d, i) => pointAt(i * angleStep, (Math.max(0, Math.min(100, d.value)) / 100) * RADIUS));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="absolute inset-0">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cielo estrellado de fondo */}
        {BACKGROUND_STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--color-foreground)" fillOpacity={s.o} />
        ))}

        {/* Anillos de referencia, casi imperceptibles */}
        {[0.35, 0.65, 1].map((r) => (
          <polygon
            key={r}
            points={data.map((_, i) => { const p = pointAt(i * angleStep, RADIUS * r); return `${p.x},${p.y}`; }).join(" ")}
            fill="none"
            stroke="var(--color-foreground)"
            strokeOpacity={0.06}
          />
        ))}

        {/* Líneas del eje hacia cada estrella */}
        {axisPoints.map((p, i) => (
          <line key={data[i]!.key} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="var(--color-foreground)" strokeOpacity={0.08} />
        ))}

        {/* La figura — como una constelación trazada entre estrellas */}
        <polygon points={dataPath} fill="var(--color-accent)" fillOpacity={0.1} stroke="var(--color-accent)" strokeOpacity={0.55} strokeWidth={1.25} />

        {/* Nodos — cada uno es una "estrella" con halo de capas sólidas (sin blur) */}
        {dataPoints.map((p, i) => {
          const isHighlight = data[i]!.key === highlightKey;
          const haloR = isHighlight ? 26 : 16;
          return (
            <g key={data[i]!.key}>
              <circle cx={p.x} cy={p.y} r={haloR} fill="url(#starGlow)" opacity={isHighlight ? 1 : 0.55} />
              <circle cx={p.x} cy={p.y} r={isHighlight ? 6 : 4} fill="var(--color-accent)" />
              <circle cx={p.x} cy={p.y} r={isHighlight ? 2.5 : 1.6} fill="var(--color-background)" />
            </g>
          );
        })}
      </svg>

      {data.map((d, i) => {
        const p = pointAt(i * angleStep, LABEL_RADIUS);
        const isHighlight = d.key === highlightKey;
        return (
          <div
            key={d.key}
            className="absolute w-24 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: p.x, top: p.y }}
          >
            <p className={`text-[13px] leading-tight ${isHighlight ? "text-foreground" : "text-foreground/70"}`}>{d.label}</p>
            <p className="mt-0.5 font-serif text-xl text-accent">{Math.round(d.value)}</p>
          </div>
        );
      })}
    </div>
  );
}
