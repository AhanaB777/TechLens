import { useDashboardData } from '../hooks/useDashboardData.js'
import DashboardHeader from './dashboard/DashboardHeader.jsx'
import CareerGoalCard from './dashboard/CareerGoalCard.jsx'
import ReadinessCard from './dashboard/ReadinessCard.jsx'
import CompetencyOverview from './dashboard/CompetencyOverview.jsx'
import SkillGapSummary from './dashboard/SkillGapSummary.jsx'
import RoadmapSummary from './dashboard/RoadmapSummary.jsx'
import NextActionCard from './dashboard/NextActionCard.jsx'
import RecentActivity from './dashboard/RecentActivity.jsx'
import {
  DashboardLoadingState,
  DashboardErrorState,
  DashboardEmptyState,
} from './dashboard/DashboardStates.jsx'

export default function Dashboard() {
  const { data, status, reload } = useDashboardData()

  if (status === 'loading') return <DashboardLoadingState />
  if (status === 'error') return <DashboardErrorState onRetry={reload} />

  const { user, careerGoal, readiness, competencies, skillGaps, roadmap, nextAction, recentActivity } = data

  // New-user path: no career goal yet means nothing downstream has data
  // worth showing — an onboarding checklist serves the user far better
  // than five empty cards.
  if (!careerGoal?.isSet) {
    return (
      <>
        <DashboardHeader userName={user.name} />
        <DashboardEmptyState />
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        userName={user.name}
        targetRole={user.targetRole}
        experienceLevel={user.experienceLevel}
      />

      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CareerGoalCard careerGoal={careerGoal} />
          <ReadinessCard readiness={readiness} />
        </div>

        <CompetencyOverview competencies={competencies} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkillGapSummary skillGaps={skillGaps} />
          <RoadmapSummary roadmap={roadmap} />
        </div>

        <NextActionCard nextAction={nextAction} />

        <RecentActivity activity={recentActivity} />
      </div>
    </>
  )
}
