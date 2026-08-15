import { useProgressData } from '../hooks/useProgressData.js'
import ProgressSummary from './progress/ProgressSummary.jsx'
import ReadinessTrend from './progress/ReadinessTrend.jsx'
import CompetencyGrowth from './progress/CompetencyGrowth.jsx'
import RoadmapProgressSummary from './progress/RoadmapProgressSummary.jsx'
import MilestoneHistory from './progress/MilestoneHistory.jsx'
import AssessmentHistory from './progress/AssessmentHistory.jsx'
import ProgressInsight from './progress/ProgressInsight.jsx'
import NextStepCard from './progress/NextStepCard.jsx'
import { ProgressLoadingState, ProgressErrorState, ProgressEmptyState } from './progress/ProgressStates.jsx'

export default function Progress() {
  const { data, status, reload } = useProgressData()

  if (status === 'loading') return <ProgressLoadingState />
  if (status === 'error') return <ProgressErrorState onRetry={reload} />

  const hasHistory = data.readinessHistory.length > 0

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Progress</h1>
        <p className="text-ink-muted mt-1">
          See how your competencies, roadmap, and career readiness are evolving
          {data.targetRole && <> toward {data.targetRole}</>}.
        </p>
      </div>

      {!hasHistory ? (
        <ProgressEmptyState />
      ) : (
        <div className="space-y-6">
          <ProgressSummary
            readinessNow={data.readinessNow}
            readinessDeltaSinceStart={data.readinessDeltaSinceStart}
            roadmap={data.roadmap}
            averageGrowth={data.averageGrowth}
          />

          <ReadinessTrend history={data.readinessHistory} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CompetencyGrowth growth={data.competencyGrowth} />
            <RoadmapProgressSummary roadmap={data.roadmap} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MilestoneHistory milestones={data.recentMilestones} />
            <AssessmentHistory assessments={data.recentAssessments} />
          </div>

          <ProgressInsight
            readinessDeltaSincePrevious={data.readinessDeltaSincePrevious}
            biggestImprovement={data.biggestImprovement}
            remainingPriorityAreas={data.remainingPriorityAreas}
          />

          <NextStepCard currentFocusTitle={data.currentFocusTitle} />
        </div>
      )}
    </>
  )
}
