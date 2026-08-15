import Card from './Card.jsx'
import Button from './Button.jsx'

/**
 * Summary card for a single assessment (title, skill, status, action).
 * Not used on the Dashboard yet — shared primitive for the Assessments
 * flow referenced by later parts.
 */
export default function AssessmentCard({ title, skillName, status = 'Not started', onStart }) {
  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink-muted mt-0.5">
          {skillName} · {status}
        </p>
      </div>
      <Button size="sm" variant="secondary" onClick={onStart}>
        Start
      </Button>
    </Card>
  )
}
