import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import SkillBar from '../../components/SkillBar.jsx'
import { IconArrowRight, IconRefresh } from '../../components/icons.jsx'
import { useCompetencyProfile } from '../../hooks/useCompetencyProfile.js'

export default function CurrentSkills() {
  const { data, status, reload } = useCompetencyProfile()

  const skills = (data?.competencies ?? [])
    .filter((skill) => skill.score != null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <Card className="p-5">
      <CardHeader
        eyebrow="Current skills"
        title="What you know today"
        action={
          <Button as={Link} to="/competency-profile" variant="ghost" size="sm" icon={IconArrowRight}>
            View profile
          </Button>
        }
      />

      {status === 'loading' && (
        <div className="min-h-28 flex items-center" aria-live="polite">
          <LoadingSpinner />
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4">
          <p className="text-sm text-ink-muted">Unable to load current skills.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={reload} icon={IconRefresh}>
            Try again
          </Button>
        </div>
      )}

      {status === 'success' && (
        skills.length ? (
          <div className="mt-4 space-y-3.5">
            {skills.map((skill) => (
              <SkillBar key={skill.id} name={skill.name} score={skill.score} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted mt-4">No competency data available yet.</p>
        )
      )}
    </Card>
  )
}
