import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconAlert, IconTrendUp } from '../../components/icons.jsx'

export function ProgressLoadingState() {
  const block = (className) => <div className={`animate-pulse rounded bg-canvas ${className}`} />

  return (
    <div aria-busy="true" aria-label="Loading your progress" className="space-y-6">
      {block('h-7 w-56')}
      <Card className="p-6 h-28">{block('h-full w-full')}</Card>
      <Card className="p-5 h-48">{block('h-full w-full')}</Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5 h-40">{block('h-full w-full')}</Card>
        <Card className="p-5 h-40">{block('h-full w-full')}</Card>
      </div>
    </div>
  )
}

export function ProgressErrorState({ onRetry }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center max-w-lg mx-auto mt-12">
      <div className="rounded-full bg-critical-soft text-critical p-3 mb-4">
        <IconAlert width={22} height={22} />
      </div>
      <h2 className="text-lg font-semibold text-ink">We couldn't load your progress</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Something went wrong while loading your development history.
      </p>
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
        Try again
      </Button>
    </Card>
  )
}

export function ProgressEmptyState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-primary-soft text-primary p-3 inline-flex mb-4">
        <IconTrendUp width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">Your progress story starts here</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Complete your first assessment and roadmap activities to start tracking your development.
      </p>
      <Button as={Link} to="/roadmap" className="mt-6">
        View roadmap
      </Button>
    </Card>
  )
}
