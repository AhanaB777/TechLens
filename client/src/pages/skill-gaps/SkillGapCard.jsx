import Card from '../../components/Card.jsx'
import SkillBadge from '../../components/SkillBadge.jsx'

function ComparisonBar({ current, required }) {
  return (
    <div className="mt-3 space-y-2">
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-ink-muted">Current</span>
          <span className="font-mono text-xs text-ink-muted tabular">
            {current == null ? 'Not assessed' : current}
          </span>
        </div>
        <div className="h-2 rounded-full bg-canvas overflow-hidden">
          {current != null && (
            <div className="h-2 rounded-full bg-primary" style={{ width: `${current}%` }} />
          )}
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-ink-muted">Required</span>
          <span className="font-mono text-xs text-ink-muted tabular">{required}</span>
        </div>
        <div className="h-2 rounded-full bg-canvas overflow-hidden">
          <div className="h-2 rounded-full bg-ink-faint" style={{ width: `${required}%` }} />
        </div>
      </div>
    </div>
  )
}

/** competency here is already gap-analyzed (see utils/skillGapUtils.js). */
export default function SkillGapCard({ competency }) {
  const { name, category, current, required, gap, priority, notAssessed, onTrack, whyItMatters } =
    competency

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-ink-faint mt-0.5">{category}</p>
        </div>
        <SkillBadge tone={priority.tone}>{priority.label}</SkillBadge>
      </div>

      <ComparisonBar current={current} required={required} />

      <p className="text-xs text-ink-muted mt-3">
        {notAssessed
          ? 'Complete an assessment to measure this competency.'
          : onTrack
            ? `${current - required} points above target`
            : `Gap: ${gap} points`}
      </p>

      {whyItMatters && !onTrack && (
        <p className="text-xs text-ink-muted mt-2 pt-2 border-t border-border">{whyItMatters}</p>
      )}
    </Card>
  )
}
