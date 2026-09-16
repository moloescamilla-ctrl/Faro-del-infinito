import { CATEGORIES } from "../data/config.js";

const SIZE = 380;
const CENTER = SIZE / 2;
const MAX_R = 100;
const LEVELS = 4;

// Etiquetas cortas para que quepan en el eje del radar sin recortarse.
const SHORT_LABEL = {
  relajacion: "Relajación",
  enfoque: "Enfoque",
  abundancia: "Abundancia",
  sanacion: "Sanación",
  expansion: "Expansión",
};

function pointAt(index, total, radius) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function polygonPoints(values, max) {
  return values
    .map((v, i) => {
      const r = (Math.max(v, 0) / max) * MAX_R;
      const { x, y } = pointAt(i, values.length, r);
      return `${x},${y}`;
    })
    .join(" ");
}

// Mapa visual de resultados: un pentágono con un eje por categoría,
// el área sombreada crece hacia el eje de mayor puntaje del quiz.
export default function RadarChart({ scores, topKey }) {
  const total = CATEGORIES.length;
  const values = CATEGORIES.map((c) => scores[c.key] || 0);
  const max = Math.max(...values, 1);

  const rings = Array.from({ length: LEVELS }, (_, i) => {
    const r = (MAX_R / LEVELS) * (i + 1);
    return CATEGORIES.map((_, idx) => pointAt(idx, total, r))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="radar"
      role="img"
      aria-label="Mapa visual de tu resultado"
    >
      {rings.map((pts, i) => (
        <polygon key={i} points={pts} className="radar__ring" />
      ))}

      {CATEGORIES.map((cat, i) => {
        const { x, y } = pointAt(i, total, MAX_R);
        const labelPt = pointAt(i, total, MAX_R + 42);
        return (
          <g key={cat.key}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              className="radar__axis"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={
                cat.key === topKey ? "radar__label radar__label--top" : "radar__label"
              }
            >
              {SHORT_LABEL[cat.key]}
            </text>
          </g>
        );
      })}

      <polygon points={polygonPoints(values, max)} className="radar__shape" />

      {CATEGORIES.map((cat, i) => {
        const r = (Math.max(values[i], 0) / max) * MAX_R;
        const { x, y } = pointAt(i, total, r);
        return (
          <circle
            key={cat.key}
            cx={x}
            cy={y}
            r={cat.key === topKey ? 6 : 4}
            className={
              cat.key === topKey ? "radar__dot radar__dot--top" : "radar__dot"
            }
          />
        );
      })}
    </svg>
  );
}
