import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import { IconTarget, IconArrowRight } from '../../components/icons.jsx'

export default function CareerTargetSummary({ careerGoal }) {
  return (
    <Card className="p-5 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <CardHeader
          eyebrow="Your target"
          action={<IconTarget width={18} height={18} className="text-ink-faint" />}
        />
        <p className="font-display text-lg font-semibold text-ink mt-2">{careerGoal.role}</p>
        <p className="text-sm text-ink-muted mt-0.5">
          {careerGoal.level} · {careerGoal.timeline} goal
        </p>
      </div>
      <Link
        to="/career-goal"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
      >
        View career goal
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
