import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import RoadmapItem from '../../components/RoadmapItem.jsx'
import { IconArrowRight, IconRoute } from '../../components/icons.jsx'

export default function RoadmapSummary({ roadmap }) {
  if (!roadmap?.steps?.length) {
    return (
      <Card className="p-5 h-full">
        <CardHeader eyebrow="Your roadmap" />
        <p className="text-sm text-ink-muted mt-2">
          Your personalized roadmap will appear here once your skill gaps are identified.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-5 flex flex-col h-full">
      <CardHeader
        eyebrow="Your roadmap"
        action={<IconRoute width={18} height={18} className="text-ink-faint" />}
      />
      <p className="text-sm font-medium text-ink mt-2">{roadmap.targetRole}</p>
      <div className="mt-3">
        <ProgressBar value={roadmap.progress} trailing={`${roadmap.progress}%`} tone="primary" />
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {roadmap.steps.map((step) => (
          <RoadmapItem key={step.name} name={step.name} status={step.status} />
        ))}
      </div>
      {roadmap.currentFocus && (
        <p className="text-xs text-ink-muted mt-4">
          Current focus:{' '}
          <span className="text-ink font-medium">{roadmap.currentFocus}</span>
        </p>
      )}
      <Link
        to="/roadmap"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-4"
      >
        Continue roadmap
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
