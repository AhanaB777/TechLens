import Card, { CardHeader } from '../../components/Card.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'

export default function RoadmapOverview({ targetRole, progress, counts }) {
  return (
    <Card className="p-5">
      <CardHeader eyebrow={`${targetRole} roadmap`} />
      <div className="mt-2">
        <ProgressBar value={progress} trailing={`${progress}%`} tone="primary" />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-ink-muted">
        <span>
          <span className="font-mono font-medium text-ink">{counts.completed}</span> completed
        </span>
        <span>
          <span className="font-mono font-medium text-ink">{counts.inProgress}</span> in progress
        </span>
        <span>
          <span className="font-mono font-medium text-ink">{counts.upcoming}</span> remaining
        </span>
      </div>
    </Card>
  )
}
