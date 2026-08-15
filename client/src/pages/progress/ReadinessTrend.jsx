import Card, { CardHeader } from '../../components/Card.jsx'
import { shortDate } from '../../utils/formatters.js'

const WIDTH = 560
const HEIGHT = 160
const PADDING = { top: 16, right: 12, bottom: 28, left: 12 }

/**
 * Small hand-built line chart — three to a handful of points doesn't
 * justify pulling in a charting dependency. The SVG is decorative
 * (aria-hidden); the point list below it carries the same information
 * as real text, so screen readers and small viewports aren't left with
 * only a picture to interpret.
 */
export default function ReadinessTrend({ history }) {
  if (history.length < 2) {
    return (
      <Card className="p-5">
        <CardHeader eyebrow="Career readiness over time" />
        <p className="text-sm text-ink-muted mt-2">
          Not enough assessment history yet to show a trend. Complete another assessment to start
          tracking change over time.
        </p>
      </Card>
    )
  }

  const scores = history.map((h) => h.score)
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = Math.max(max - min, 1)
  const plotWidth = WIDTH - PADDING.left - PADDING.right
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom

  const points = history.map((h, i) => {
    const x = PADDING.left + (plotWidth * i) / (history.length - 1)
    const y = PADDING.top + plotHeight - ((h.score - min) / range) * plotHeight
    return { ...h, x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const latest = history[history.length - 1]

  return (
    <Card className="p-5">
      <CardHeader eyebrow="Career readiness over time" />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full mt-3"
        role="img"
        aria-label={`Career readiness trend from ${history[0].score}% to ${latest.score}%`}
      >
        <path d={linePath} fill="none" stroke="#3642C4" strokeWidth={2} strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={p.date}>
            <circle
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 5 : 3.5}
              fill={i === points.length - 1 ? '#E2A63B' : '#3642C4'}
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
            <text x={p.x} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill="#6B7280">
              {shortDate(p.date)}
            </text>
          </g>
        ))}
      </svg>

      <p className="text-sm text-ink-muted mt-1">
        <span className="font-mono font-medium text-ink tabular">{latest.score}%</span> as of{' '}
        {shortDate(latest.date)}, up from {history[0].score}% on {shortDate(history[0].date)}.
      </p>
    </Card>
  )
}
