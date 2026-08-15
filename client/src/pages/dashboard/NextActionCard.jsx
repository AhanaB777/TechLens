import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconArrowRight } from '../../components/icons.jsx'

export default function NextActionCard({ nextAction }) {
  if (!nextAction) return null

  return (
    <Card className="p-6 bg-primary text-white border-primary relative overflow-hidden">
      <div className="relative">
        <p className="eyebrow text-white/70 mb-2 [&::before]:bg-accent">Your next step</p>
        <h3 className="font-display text-xl font-semibold">{nextAction.title}</h3>
        <p className="text-sm text-white/80 mt-2 max-w-xl">{nextAction.description}</p>
        <Button
          as={Link}
          to="/roadmap"
          variant="secondary"
          icon={IconArrowRight}
          className="!bg-white !text-primary !border-transparent hover:!bg-white/90 mt-4"
        >
          {nextAction.actionLabel}
        </Button>
      </div>
    </Card>
  )
}
