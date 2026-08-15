import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { IconArrowRight } from '../../components/icons.jsx'
import { taskProgress, nextIncompleteTask } from '../../utils/roadmapUtils.js'

/**
 * Spotlight on the current milestone. `onFocusTask` scrolls/expands the
 * relevant milestone card rather than duplicating task UI here.
 */
export default function CurrentFocusCard({ milestone, onContinue }) {
  if (!milestone) return null

  const progress = taskProgress(milestone.tasks)
  const next = nextIncompleteTask(milestone)

  return (
    <Card className="p-6 bg-primary text-white border-primary">
      <p className="eyebrow text-white/70 mb-2 [&::before]:bg-accent">Current focus</p>
      <h3 className="font-display text-xl font-semibold">{milestone.title}</h3>

      {milestone.whyOnRoadmap && (
        <p className="text-sm text-white/80 mt-2 max-w-xl">{milestone.whyOnRoadmap}</p>
      )}

      <div className="mt-4 max-w-sm">
        <ProgressBar value={progress} trailing={`${progress}%`} tone="primary" />
      </div>

      {next && <p className="text-sm text-white/70 mt-3">Next up: {next.title}</p>}

      <Button
        variant="secondary"
        icon={IconArrowRight}
        onClick={onContinue}
        className="!bg-white !text-primary !border-transparent hover:!bg-white/90 mt-4"
      >
        Continue
      </Button>
    </Card>
  )
}
