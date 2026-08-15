import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconAlert, IconTarget, IconLayers, IconRoute } from '../../components/icons.jsx'

export function RoadmapLoadingState() {
  const block = (className) => <div className={`animate-pulse rounded bg-canvas ${className}`} />

  return (
    <div aria-busy="true" aria-label="Loading your roadmap" className="space-y-6">
      {block('h-7 w-56')}
      <Card className="p-5 h-24">{block('h-full w-full')}</Card>
      <Card className="p-6 h-36">{block('h-full w-full')}</Card>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          {block('h-4 w-40')}
          <Card className="p-4 h-16">{block('h-full w-full')}</Card>
          <Card className="p-4 h-16">{block('h-full w-full')}</Card>
        </div>
      ))}
    </div>
  )
}

export function RoadmapErrorState({ onRetry }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center max-w-lg mx-auto mt-12">
      <div className="rounded-full bg-critical-soft text-critical p-3 mb-4">
        <IconAlert width={22} height={22} />
      </div>
      <h2 className="text-lg font-semibold text-ink">We couldn't load your roadmap</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Something went wrong while loading your career development plan.
      </p>
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
        Try again
      </Button>
    </Card>
  )
}

/** No career goal set — a roadmap has nowhere to point. */
export function NoCareerGoalState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-primary-soft text-primary p-3 inline-flex mb-4">
        <IconTarget width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">Your roadmap starts with a goal</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Set your target career to generate a personalized development roadmap.
      </p>
      <Button as={Link} to="/career-goal" className="mt-6">
        Set career goal
      </Button>
    </Card>
  )
}

/** Goal exists, but current competencies already meet it — nothing to build a plan around. */
export function NoGapsState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-success-soft text-success p-3 inline-flex mb-4">
        <IconLayers width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">Your roadmap is ready</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Your current competencies already align well with your target role. Continue developing
        and reassessing your skills to maintain readiness.
      </p>
      <Button as={Link} to="/competency-profile" variant="secondary" className="mt-6">
        View competency profile
      </Button>
    </Card>
  )
}

/** Goal + gaps exist, but the plan itself hasn't been generated yet. */
export function NotGeneratedState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-primary-soft text-primary p-3 inline-flex mb-4">
        <IconRoute width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">Your roadmap is being prepared</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Your competency gaps have been identified. The next step is to turn them into an
        actionable development plan.
      </p>
      <Button as={Link} to="/skill-gaps" variant="secondary" className="mt-6">
        Review skill gaps
      </Button>
    </Card>
  )
}

/** Every milestone complete. */
export function RoadmapCompleteState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <h2 className="text-lg font-display font-semibold text-ink">Career roadmap complete 🎉</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        You've completed your current development roadmap. This reflects the plan you've followed
        — it isn't a guarantee of job readiness.
      </p>
      <p className="text-sm text-ink-muted mt-2">
        Next step: reassess your competencies to measure your progress toward your target role.
      </p>
      <Button as={Link} to="/competency-profile" className="mt-6">
        View competency profile
      </Button>
    </Card>
  )
}
