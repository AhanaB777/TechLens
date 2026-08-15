import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconAlert, IconLayers } from '../../components/icons.jsx'

export function CompetencyLoadingState() {
  const block = (className) => <div className={`animate-pulse rounded bg-canvas ${className}`} />

  return (
    <div aria-busy="true" aria-label="Loading your competency profile" className="space-y-6">
      {block('h-7 w-64')}
      <Card className="p-6 h-40">{block('h-full w-full')}</Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 h-40">
            {block('h-full w-full')}
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CompetencyErrorState({ onRetry }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center max-w-lg mx-auto mt-12">
      <div className="rounded-full bg-critical-soft text-critical p-3 mb-4">
        <IconAlert width={22} height={22} />
      </div>
      <h2 className="text-lg font-semibold text-ink">We couldn't load your competency profile</h2>
      <p className="text-sm text-ink-muted mt-1.5">Please try again.</p>
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
        Try again
      </Button>
    </Card>
  )
}

export function CompetencyEmptyState() {
  return (
    <Card className="p-8 lg:p-10 max-w-xl mx-auto mt-6 text-center">
      <div className="rounded-full bg-primary-soft text-primary p-3 inline-flex mb-4">
        <IconLayers width={22} height={22} />
      </div>
      <h2 className="text-lg font-display font-semibold text-ink">
        Your competency profile isn't ready yet
      </h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Complete your first assessment or add evidence to begin building your competency profile.
      </p>
      <Button as={Link} to="/skill-gaps" className="mt-6">
        Take assessment
      </Button>
    </Card>
  )
}
