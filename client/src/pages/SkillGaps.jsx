import { Link } from 'react-router-dom'
import { useSkillGapData } from '../hooks/useSkillGapData.js'
import { IconArrowRight, IconLayers } from '../components/icons.jsx'
import CareerTargetSummary from './skill-gaps/CareerTargetSummary.jsx'
import GapOverview from './skill-gaps/GapOverview.jsx'
import SkillGapList from './skill-gaps/SkillGapList.jsx'
import OnTrackSection from './skill-gaps/OnTrackSection.jsx'
import BiggestGapsSection from './skill-gaps/BiggestGapsSection.jsx'
import NextFocusCard from './skill-gaps/NextFocusCard.jsx'
import {
  SkillGapLoadingState,
  SkillGapErrorState,
  NoCareerGoalState,
  NoProfileState,
  AllOnTrackState,
} from './skill-gaps/SkillGapStates.jsx'
import { withGapAnalysis, summarizeGaps, strongestAlignment, biggestGaps, getNextFocus } from '../utils/skillGapUtils.js'

export default function SkillGaps() {
  const { data, status, reload } = useSkillGapData()

  if (status === 'loading') return <SkillGapLoadingState />
  if (status === 'error') return <SkillGapErrorState onRetry={reload} />

  const header = (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">Skill Gaps</h1>
      <p className="text-ink-muted mt-1">
        Understand what stands between your current capabilities and your target career.
      </p>
    </div>
  )

  if (!data.careerGoal?.isSet) {
    return (
      <>
        {header}
        <NoCareerGoalState />
      </>
    )
  }

  if (!data.competencyProfileReady) {
    return (
      <>
        {header}
        <NoProfileState />
      </>
    )
  }

  const analyzed = withGapAnalysis(data.competencies)
  const summary = summarizeGaps(analyzed)
  const allOnTrack = summary.needsImprovement === 0 && summary.notAssessed === 0

  return (
    <>
      {header}

      <div className="space-y-5">
        <CareerTargetSummary careerGoal={data.careerGoal} />
        <GapOverview readiness={data.readiness} summary={summary} />

        {allOnTrack ? (
          <AllOnTrackState />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <OnTrackSection competencies={strongestAlignment(analyzed)} />
              <BiggestGapsSection competencies={biggestGaps(analyzed)} />
            </div>

            <NextFocusCard focus={getNextFocus(analyzed)} />

            <SkillGapList competencies={analyzed} />
          </>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
          <Link
            to="/competency-profile"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            <IconLayers width={14} height={14} />
            View competency profile
          </Link>
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View roadmap
            <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </div>
    </>
  )
}
