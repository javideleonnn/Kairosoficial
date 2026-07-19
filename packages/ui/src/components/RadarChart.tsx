export interface RadarDatum {
  key: string;
  label: string;
  /** 0-100 */
  value: number;
}

interface RadarChartProps {
  data: RadarDatum[];
  highlightKey?: string;
  size?: number;
}

const CENTER = 100;
const RADIUS = 72;

function pointAt(angleDeg: number, distance: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + distance * Math.cos(angleRad),
    y: CENTER + distance * Math.sin(angleRad),
  };
}

export function RadarChart({
  data,
  highlightKey,
  size = 260,
}: RadarChartProps): React.JSX.Element {
  const n = data.length;
  const angleStep = 360 / n;

  const axisPoints = data.map((_, i) => pointAt(i * angleStep, RADIUS));
  const dataPoints = data.map((d, i) => pointAt(i * angleStep, (Math.max(0, Math.min(100, d.value)) / 100) * RADIUS));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Anillos de referencia (25/50/75/100%) — ayudan a leer la magnitud sin números.
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="mx-auto"
      style={{
        animation: "fade-in-up 700ms var(--ease-kairos) forwards",
      }}
    >
      {rings.map((r) => (
        <polygon
          key={r}
          points={data
            .map((_, i) => {
              const p = pointAt(i * angleStep, RADIUS * r);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="var(--color-foreground)"
          strokeOpacity={0.08}
        />
      ))}

      {axisPoints.map((p, i) => (
        <line
          key={data[i]!.key}
          x1={CENTER}
          y1={CENTER}
          x2={p.x}
          y2={p.y}
          stroke="var(--color-foreground)"
          strokeOpacity={0.12}
        />
      ))}

      <polygon
        points={dataPath}
        fill="var(--color-accent)"
        fillOpacity={0.22}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
      />

      {dataPoints.map((p, i) => {
        const isHighlight = data[i]!.key === highlightKey;
        return (
          <circle
            key={data[i]!.key}
            cx={p.x}
            cy={p.y}
            r={isHighlight ? 4 : 2.5}
            fill="var(--color-accent)"
            style={isHighlight ? { filter: "drop-shadow(0 0 4px var(--color-accent))" } : undefined}
          />
        );
      })}

      {axisPoints.map((p, i) => {
        const labelPoint = pointAt(i * angleStep, RADIUS + 14);
        return (
          <text
            key={data[i]!.key}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="var(--color-foreground)"
            fillOpacity={data[i]!.key === highlightKey ? 1 : 0.5}
          >
            {data[i]!.label}
          </text>
        );
      })}
    </svg>
  );
}
