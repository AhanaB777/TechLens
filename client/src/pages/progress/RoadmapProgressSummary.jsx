import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { IconArrowRight } from '../../components/icons.jsx'

export default function RoadmapProgressSummary({ roadmap }) {
  return (
    <Card className="p-5">
      <CardHeader eyebrow="Roadmap progress" />
      <div className="mt-3">
        <ProgressBar value={roadmap.overall} trailing={`${roadmap.overall}% overall`} tone="primary" />
      </div>
      <div className="mt-4 space-y-3">
        {roadmap.phases.map((phase) => (
          <ProgressBar key={phase.id} label={phase.title} value={phase.progress} size="sm" showValue />
        ))}
      </div>
      <Link
        to="/roadmap"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-4"
      >
        View roadmap
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
