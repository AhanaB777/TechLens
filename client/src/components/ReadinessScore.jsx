// Signature element of the TechLens design system: a radial dial styled
// like a calibration instrument (tick marks + a swept arc), because the
// number it shows is literally a measured reading, not a decoration.
// Reusable anywhere a 0-100 readiness/confidence score needs a dial.

const SIZE = 176
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CENTER = SIZE / 2
// Gauge sweeps 270°, starting at 135° (bottom-left) around to 45° (bottom-right).
const START_ANGLE = 135
const SWEEP = 270

function polarToCartesian(angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + RADIUS * Math.cos(angleRad),
    y: CENTER + RADIUS * Math.sin(angleRad),
  }
}

function arcPath(startAngle, endAngle) {
  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export default function ReadinessScore({ score, previousScore, statusLabel }) {
  const clamped = Math.max(0, Math.min(100, score))
  const valueAngle = START_ANGLE + (SWEEP * clamped) / 100
  const trend = previousScore != null ? score - previousScore : null

  const ticks = Array.from({ length: 11 }, (_, i) => START_ANGLE + (SWEEP * i) / 10)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-hidden="true">
          {/* track */}
          <path
            d={arcPath(START_ANGLE, START_ANGLE + SWEEP)}
            fill="none"
            stroke="#EEF0F5"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* calibration ticks */}
          {ticks.map((angle, i) => {
            const inner = RADIUS - STROKE / 2 - 3
            const outer = RADIUS - STROKE / 2 - 8
            const angleRad = ((angle - 90) * Math.PI) / 180
            const x1 = CENTER + inner * Math.cos(angleRad)
            const y1 = CENTER + inner * Math.sin(angleRad)
            const x2 = CENTER + outer * Math.cos(angleRad)
            const y2 = CENTER + outer * Math.sin(angleRad)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D7DAE4"
                strokeWidth={1.5}
              />
            )
          })}
          {/* value arc */}
          <path
            d={arcPath(START_ANGLE, valueAngle)}
            fill="none"
            stroke="#3642C4"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* current-value marker */}
          <circle
            cx={polarToCartesian(valueAngle).x}
            cy={polarToCartesian(valueAngle).y}
            r={5}
            fill="#E2A63B"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-semibold text-ink tabular">{clamped}</span>
          <span className="text-xs text-ink-muted mt-0.5">out of 100</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        {trend != null && (
          <p className={`text-sm font-medium ${trend >= 0 ? 'text-success' : 'text-critical'}`}>
            {trend >= 0 ? '+' : ''}
            {trend} since last assessment
          </p>
        )}
        {statusLabel && <p className="text-sm text-ink-muted mt-0.5">{statusLabel}</p>}
      </div>
    </div>
  )
}
