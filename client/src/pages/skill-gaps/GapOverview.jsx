import Card, { CardHeader } from '../../components/Card.jsx'
import { readinessStatus } from '../../utils/scoreUtils.js'

function DistributionSegment({ label, count, total, className }) {
  if (count === 0) return null
  const pct = Math.round((count / total) * 100)
  return (
    <div className="flex-1 min-w-[7rem]">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-ink">{label}</span>
        <span className="font-mono text-sm text-ink-muted tabular">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-canvas overflow-hidden">
        <div className={`h-2 rounded-full ${className}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function GapOverview({ readiness, summary }) {
  return (
    <Card className="p-5">
      <CardHeader eyebrow="Career readiness" />
      <div className="flex items-baseline gap-3 mt-2">
        <span className="font-mono text-3xl font-semibold text-ink tabular">{readiness}%</span>
        <span className="text-sm text-ink-muted">{readinessStatus(readiness)}</span>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-ink-muted">
        <span>
          <span className="font-mono font-medium text-ink">{summary.evaluated}</span> competencies evaluated
        </span>
        <span>
          <span className="font-mono font-medium text-ink">{summary.onTrack}</span> on track
        </span>
        <span>
          <span className="font-mono font-medium text-ink">{summary.needsImprovement}</span> need improvement
        </span>
        {summary.notAssessed > 0 && (
          <span>
            <span className="font-mono font-medium text-ink">{summary.notAssessed}</span> not assessed
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-4 mt-5 pt-5 border-t border-border">
        <DistributionSegment
          label="On track"
          count={summary.onTrack}
          total={summary.evaluated}
          className="bg-success"
        />
        <DistributionSegment
          label="Needs improvement"
          count={summary.needsImprovement}
          total={summary.evaluated}
          className="bg-warning"
        />
        <DistributionSegment
          label="Not assessed"
          count={summary.notAssessed}
          total={summary.evaluated}
          className="bg-ink-faint"
        />
      </div>
    </Card>
  )
}
