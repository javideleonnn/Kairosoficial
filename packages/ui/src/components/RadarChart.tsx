export interface RadarDatum {
  key: string;
  label: string;
  /** 0-100 */
  value: number;
}

interface RadarChartProps {
  data: RadarDatum[];
  highlightKey?: string;
  /** ancho máximo en px — el SVG es responsive (width: 100%) hasta este tope,
   * así nunca desborda en pantallas angostas aunque el número sea grande */
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

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="mx-auto" style={{ width: "100%", maxWidth: size }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
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

        {axisPoints.map((p, i) => {
          const isHighlight = data[i]!.key === highlightKey;
          return (
            <line
              key={data[i]!.key}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke={isHighlight ? "var(--color-accent)" : "var(--color-foreground)"}
              strokeOpacity={isHighlight ? 0.45 : 0.12}
              strokeWidth={isHighlight ? 1.2 : 1}
            />
          );
        })}

        <g
          style={{
            transformOrigin: "100px 100px",
            animation: "radar-draw 800ms var(--ease-kairos) forwards",
          }}
        >
          <polygon
            points={dataPath}
            fill="var(--color-foreground)"
            fillOpacity={0.08}
            stroke="var(--color-foreground)"
            strokeOpacity={0.4}
            strokeWidth={1.25}
          />

          {dataPoints.map((p, i) => {
            const isHighlight = data[i]!.key === highlightKey;
            return (
              <circle
                key={data[i]!.key}
                cx={p.x}
                cy={p.y}
                r={isHighlight ? 4.5 : 2.5}
                fill={isHighlight ? "var(--color-accent)" : "var(--color-foreground)"}
                fillOpacity={isHighlight ? 1 : 0.5}
                style={isHighlight ? { filter: "drop-shadow(0 0 5px var(--color-accent))" } : undefined}
              />
            );
          })}
        </g>

        {axisPoints.map((p, i) => {
          const isHighlight = data[i]!.key === highlightKey;
          const labelPoint = pointAt(i * angleStep, RADIUS + 14);
          return (
            <text
              key={data[i]!.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={8}
              fill={isHighlight ? "var(--color-accent)" : "var(--color-foreground)"}
              fillOpacity={isHighlight ? 1 : 0.45}
            >
              {data[i]!.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
