import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconAlert, IconTarget, IconLayers, IconCheck } from '../../components/icons.jsx'

export function SkillGapLoadingState() {
  const block = (className) => <div className={`animate-pulse rounded bg-canvas ${className}`} />

  return (
    <div aria-busy="true" aria-label="Analyzing your skill gaps" className="space-y-6">
      {block('h-7 w-56')}
      <Card className="p-5 h-24">{block('h-full w-full')}</Card>
      <Card className="p-5 h-36">{block('h-full w-full')}</Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 h-36">
            {block('h-full w-full')}
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SkillGapErrorState({ onRetry }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center max-w-lg mx-auto mt-12">
      <div className="rounded-full bg-critical-soft text-critical p-3 mb-4">
        <IconAlert width={22} height={22} />
      </div>
      <h2 className="text-lg font-semibold text-ink">We couldn't analyze your skill gaps</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Something went wrong while loading your competency comparison.
      </p>
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
        Try again
      </Button>
    </Card>
  )
}

/** No career goal set — gaps have nothing to be measured against. */
export function NoCareerGoalState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-primary-soft text-primary p-3 inline-flex mb-4">
        <IconTarget width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">Set a career goal first</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Skill gaps are calculated against your target career. Set your career goal to discover
        which competencies you need to develop.
      </p>
      <Button as={Link} to="/career-goal" className="mt-6">
        Set career goal
      </Button>
    </Card>
  )
}

/** Career goal exists, but no competency data to compare it against yet. */
export function NoProfileState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-primary-soft text-primary p-3 inline-flex mb-4">
        <IconLayers width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">
        Your competency profile isn't ready
      </h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Complete an assessment or add evidence to begin identifying your skill gaps.
      </p>
      <Button as={Link} to="/competency-profile" className="mt-6">
        Build competency profile
      </Button>
    </Card>
  )
}

/** Positive success state — every competency meets or exceeds its target. */
export function AllOnTrackState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-success-soft text-success p-3 inline-flex mb-4">
        <IconCheck width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">You're on track 🎉</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Your current competencies meet the requirements for your target role. Keep developing and
        reassessing your skills to maintain your readiness.
      </p>
      <Button as={Link} to="/competency-profile" variant="secondary" className="mt-6">
        View competency profile
      </Button>
    </Card>
  )
}
