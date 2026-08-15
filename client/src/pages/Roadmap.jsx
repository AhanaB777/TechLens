import { Link } from 'react-router-dom'
import { useRoadmapData } from '../hooks/useRoadmapData.js'
import RoadmapOverview from './roadmap/RoadmapOverview.jsx'
import CurrentFocusCard from './roadmap/CurrentFocusCard.jsx'
import RoadmapPhase from './roadmap/RoadmapPhase.jsx'
import {
  RoadmapLoadingState,
  RoadmapErrorState,
  NoCareerGoalState,
  NoGapsState,
  NotGeneratedState,
  RoadmapCompleteState,
} from './roadmap/RoadmapStates.jsx'
import { overallProgress, milestoneCounts, findCurrentMilestone } from '../utils/roadmapUtils.js'
import { IconLayers } from '../components/icons.jsx'

export default function Roadmap() {
  const { data, status, reload, toggleTask } = useRoadmapData()

  if (status === 'loading') return <RoadmapLoadingState />
  if (status === 'error') return <RoadmapErrorState onRetry={reload} />

  const header = (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">Your Career Roadmap</h1>
      <p className="text-ink-muted mt-1">
        {data.targetRole
          ? `A personalized path to becoming a ${data.targetRole}.`
          : 'A personalized path toward your target career.'}
      </p>
    </div>
  )

  if (!data.careerGoalSet) {
    return (
      <>
        {header}
        <NoCareerGoalState />
      </>
    )
  }

  if (!data.hasIdentifiedGaps) {
    return (
      <>
        {header}
        <NoGapsState />
      </>
    )
  }

  if (!data.roadmapGenerated) {
    return (
      <>
        {header}
        <NotGeneratedState />
      </>
    )
  }

  const progress = overallProgress(data.phases)
  const counts = milestoneCounts(data.phases)
  const current = findCurrentMilestone(data.phases)

  const scrollToMilestone = (milestoneId) => {
    document.getElementById(`milestone-${milestoneId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  return (
    <>
      {header}

      <div className="space-y-6">
        <RoadmapOverview targetRole={data.targetRole} progress={progress} counts={counts} />

        {progress === 100 ? (
          <RoadmapCompleteState />
        ) : (
          <CurrentFocusCard milestone={current} onContinue={() => scrollToMilestone(current?.id)} />
        )}

        <div className="space-y-8">
          {data.phases.map((phase) => (
            <div key={phase.id} id={`phase-${phase.id}`}>
              <RoadmapPhase phase={phase} currentMilestoneId={current?.id} onToggleTask={toggleTask} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
          <Link
            to="/skill-gaps"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            <IconLayers width={14} height={14} />
            View skill gaps
          </Link>
          <Link
            to="/career-goal"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View career goal
          </Link>
        </div>
      </div>
    </>
  )
}
