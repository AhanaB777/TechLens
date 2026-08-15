import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconArrowRight } from '../../components/icons.jsx'

export default function NextFocusCard({ focus }) {
  if (!focus) return null

  return (
    <Card className="p-6 bg-primary text-white border-primary">
      <p className="eyebrow text-white/70 mb-2 [&::before]:bg-accent">Your next focus</p>
      <h3 className="font-display text-xl font-semibold">{focus.name}</h3>
      <p className="text-sm text-white/80 mt-2 max-w-xl">
        You're {focus.gap} points below the target level. Strengthening {focus.name} would address
        one of your {focus.priority.label.toLowerCase()} gaps.
      </p>
      <Button
        as={Link}
        to="/roadmap"
        variant="secondary"
        icon={IconArrowRight}
        className="!bg-white !text-primary !border-transparent hover:!bg-white/90 mt-4"
      >
        Start roadmap
      </Button>
    </Card>
  )
}
