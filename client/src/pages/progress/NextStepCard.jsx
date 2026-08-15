import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconArrowRight } from '../../components/icons.jsx'

export default function NextStepCard({ currentFocusTitle }) {
  const navigate = useNavigate()
  if (!currentFocusTitle) return null

  return (
    <Card className="p-6 bg-primary text-white border-primary">
      <p className="eyebrow text-white/70 mb-2 [&::before]:bg-accent">Keep going</p>
      <h3 className="font-display text-xl font-semibold">Your next priority is {currentFocusTitle}</h3>
      <p className="text-sm text-white/80 mt-2 max-w-xl">
        Continue your roadmap and reassess your competencies after completing the next milestone.
      </p>
      <Button
        variant="secondary"
        icon={IconArrowRight}
        onClick={() => navigate('/roadmap')}
        className="!bg-white !text-primary !border-transparent hover:!bg-white/90 mt-4"
      >
        Continue roadmap
      </Button>
    </Card>
  )
}
