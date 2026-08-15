import Card from '../../components/Card.jsx'
import { getScoreLabel } from '../../utils/scoreUtils.js'
import { useAssessmentResult } from '../../hooks/useAssessmentResult.js'

function StatBlock({ eyebrow, score, sublabel, trend }) {
  return (
    <div>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-3xl font-semibold text-ink tabular">{score != null ? `${score}%` : '—'}</span>
        {score != null && getScoreLabel(score) && (
          <span className="text-sm font-medium text-ink-muted">{getScoreLabel(score)}</span>
        )}
      </div>
      {trend != null && (
        <p className={`text-xs font-medium mt-1 ${trend >= 0 ? 'text-success' : 'text-critical'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% since previous assessment
        </p>
      )}
      {sublabel && <p className="text-xs text-ink-muted mt-1">{sublabel}</p>}
    </div>
  )
}

export default function ProfileHero({ profile }) {
  const { data: assessment, status: assessmentStatus } = useAssessmentResult()
  const verifiedCount = profile.competencies.filter((c) => c.status === 'Verified').length
  const improveCount = profile.competencies.filter(
    (c) => c.score != null && c.score < 75,
  ).length
  const overallTrend =
    profile.previousOverallScore != null
      ? profile.overallScore - profile.previousOverallScore
      : null

  return (
    <Card className="p-6">
      <p className="eyebrow mb-1">Competency profile</p>
      <h2 className="font-display text-xl font-semibold text-ink">{profile.targetRole}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <StatBlock eyebrow="Overall competency" score={profile.overallScore} trend={overallTrend} />
        <StatBlock
          eyebrow="Career readiness"
          score={profile.readiness}
          sublabel={`Your current competency profile is ${profile.readiness}% aligned with your ${profile.targetRole} goal.`}
        />
        <StatBlock
          eyebrow="Latest assessment"
          score={assessment?.completed ? Math.round((assessment.score / assessment.maxScore) * 100) : null}
          sublabel={
            assessmentStatus === 'loading'
              ? 'Loading assessment result…'
              : assessment?.completed
                ? `${assessment.score} / ${assessment.maxScore} marks`
                : 'No assessment completed yet.'
          }
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-6 pt-5 border-t border-border text-sm text-ink-muted">
        <span>
          <span className="font-mono font-medium text-ink">{verifiedCount}</span> verified competencies
        </span>
        <span>
          <span className="font-mono font-medium text-ink">{improveCount}</span> areas to improve
        </span>
      </div>
    </Card>
  )
}
