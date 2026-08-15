import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconTarget } from '../../components/icons.jsx'

export default function GoalSummary({ careerGoal, primary, onEdit, onSelect, onRemove }) {
  return (
    <Card className={`p-6 ${primary ? 'border-primary/30' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary-soft text-primary">
              <IconTarget width={17} height={17} />
            </span>
            <p className="eyebrow">{primary ? 'Primary career goal' : 'Secondary career goal'}</p>
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">{careerGoal.role}</h2>
          <p className="text-sm text-ink-muted mt-1">{careerGoal.level} · {careerGoal.domain}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!primary && (
            <Button variant="ghost" size="sm" onClick={onSelect}>
              Use as primary
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit goal
          </Button>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <p className="eyebrow mb-1">Target timeline</p>
          <p className="text-sm font-medium text-ink">{careerGoal.timeline}</p>
        </div>
        <div>
          <p className="eyebrow mb-1">What this means</p>
          <p className="text-sm text-ink-muted">
            {primary ? 'This is the career your main competency journey is currently aligned with.' : 'This is an additional career direction you are keeping open.'}
          </p>
        </div>
      </div>
    </Card>
  )
}
