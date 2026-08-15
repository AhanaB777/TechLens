import ProgressBar from '../../components/ProgressBar.jsx'
import RoadmapMilestone from './RoadmapMilestone.jsx'
import { phaseProgress, phaseStatus, milestoneStatus } from '../../utils/roadmapUtils.js'

export default function RoadmapPhase({ phase, currentMilestoneId, onToggleTask }) {
  const progress = phaseProgress(phase)
  const status = phaseStatus(phase)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="text-sm font-semibold text-ink">{phase.title}</h3>
        <span className="text-xs font-mono text-ink-muted tabular shrink-0">
          {status === 'Upcoming' ? 'Not started' : `${progress}% complete`}
        </span>
      </div>
      <p className="text-xs text-ink-muted mb-3">{phase.description}</p>
      <div className="mb-4 max-w-sm">
        <ProgressBar value={progress} tone="primary" size="sm" />
      </div>

      <div className="space-y-3">
        {phase.milestones.map((milestone) => (
          <RoadmapMilestone
            key={milestone.id}
            milestone={{ ...milestone, phaseTitle: phase.title, status: milestoneStatus(milestone) }}
            defaultOpen={milestone.id === currentMilestoneId}
            onToggleTask={onToggleTask}
          />
        ))}
      </div>
    </div>
  )
}
