import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconTarget, IconArrowRight } from '../../components/icons.jsx'

export default function CareerGoalCard({ careerGoal }) {
  if (!careerGoal?.isSet) {
    return (
      <Card className="p-5 flex flex-col h-full">
        <CardHeader eyebrow="Career goal" />
        <div className="flex-1 flex flex-col justify-center items-start py-2">
          <p className="text-sm font-semibold text-ink mb-1">No career goal set yet</p>
          <p className="text-sm text-ink-muted mb-4">
            Set your target role to begin your personalized competency journey.
          </p>
          <Button as={Link} to="/career-goal" size="sm">
            Set career goal
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5 flex flex-col h-full">
      <CardHeader
        eyebrow="Current career goal"
        action={<IconTarget width={18} height={18} className="text-ink-faint" />}
      />
      <div className="mt-2">
        <p className="text-lg font-display font-semibold text-ink">{careerGoal.role}</p>
        <p className="text-sm text-ink-muted mt-0.5">
          {careerGoal.level} · Target timeline {careerGoal.timeline}
        </p>
      </div>
      <p className="text-sm text-ink-muted mt-3 flex-1">
        Your target role determines the competencies used throughout your TechLens journey.
      </p>
      <Link
        to="/career-goal"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-4"
      >
        View career goal
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
