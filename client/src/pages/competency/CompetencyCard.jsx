import Card from '../../components/Card.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import SkillBadge from '../../components/SkillBadge.jsx'
import { statusToTone, scoreToTone, recencyLabel } from '../../utils/scoreUtils.js'

function evidenceSummary(evidence) {
  const parts = []
  if (evidence.projects) parts.push(`${evidence.projects} project${evidence.projects === 1 ? '' : 's'}`)
  if (evidence.assessments)
    parts.push(`${evidence.assessments} assessment${evidence.assessments === 1 ? '' : 's'}`)
  if (evidence.certifications)
    parts.push(`${evidence.certifications} certification${evidence.certifications === 1 ? '' : 's'}`)
  return parts.length ? parts.join(' · ') : 'No evidence yet'
}

export default function CompetencyCard({ competency, onViewDetails }) {
  const hasScore = competency.score != null

  return (
    <Card interactive className="p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{competency.name}</p>
        <span className="font-mono text-sm font-semibold text-ink tabular shrink-0">
          {hasScore ? `${competency.score}%` : '—'}
        </span>
      </div>

      <div className="mt-3">
        {hasScore ? (
          <ProgressBar value={competency.score} tone={scoreToTone(competency.score)} size="sm" />
        ) : (
          <div className="h-1.5 w-full rounded-full bg-canvas" aria-hidden="true" />
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <SkillBadge tone={statusToTone(competency.status)}>{competency.status}</SkillBadge>
        <span className="text-xs text-ink-faint">{recencyLabel(competency.lastAssessed)}</span>
      </div>

      <p className="text-xs text-ink-muted mt-3">{evidenceSummary(competency.evidence)}</p>

      <button
        onClick={() => onViewDetails(competency)}
        className="text-sm font-medium text-primary hover:text-primary-hover mt-3"
      >
        View details
      </button>
    </Card>
  )
}
