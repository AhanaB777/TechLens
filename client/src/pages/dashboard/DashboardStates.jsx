import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconAlert, IconTarget, IconLayers, IconGap, IconRoute } from '../../components/icons.jsx'

/** Skeleton that preserves the real dashboard's shape while data loads. */
export function DashboardLoadingState() {
  const block = (className) => <div className={`animate-pulse rounded bg-canvas ${className}`} />

  return (
    <div aria-busy="true" aria-label="Loading your dashboard" className="space-y-6">
      {block('h-7 w-72')}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5 h-40">{block('h-full w-full')}</Card>
        <Card className="p-5 h-40">{block('h-full w-full')}</Card>
      </div>
      <Card className="p-5 h-36">{block('h-full w-full')}</Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5 h-56">{block('h-full w-full')}</Card>
        <Card className="p-5 h-56">{block('h-full w-full')}</Card>
      </div>
    </div>
  )
}

export function DashboardErrorState({ onRetry }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center max-w-lg mx-auto mt-12">
      <div className="rounded-full bg-critical-soft text-critical p-3 mb-4">
        <IconAlert width={22} height={22} />
      </div>
      <h2 className="text-lg font-semibold text-ink">We couldn't load your dashboard</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Something went wrong while retrieving your career intelligence data.
      </p>
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
        Try again
      </Button>
    </Card>
  )
}

const STEPS = [
  { icon: IconTarget, title: 'Set your career goal', desc: 'Tell us the role you\u2019re working toward.' },
  { icon: IconLayers, title: 'Build your competency profile', desc: 'Show what you can actually do.' },
  { icon: IconGap, title: 'Identify your skill gaps', desc: 'See exactly what\u2019s missing.' },
  { icon: IconRoute, title: 'Start your roadmap', desc: 'Follow a personalized development plan.' },
]

export function DashboardEmptyState() {
  return (
    <Card className="p-8 lg:p-10 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-display font-semibold text-ink">Welcome to TechLens 👋</h2>
      <p className="text-sm text-ink-muted mt-1.5">
        Your career intelligence journey starts here.
      </p>
      <div className="mt-6 space-y-4">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon width={16} height={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">
                Step {i + 1} · {title}
              </p>
              <p className="text-sm text-ink-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button as={Link} to="/resume-upload">Upload your resume</Button>
        <Button as={Link} to="/career-goal" variant="secondary">Set your career goal</Button>
      </div>
    </Card>
  )
}
