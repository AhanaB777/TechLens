import Card, { CardHeader } from '../../components/Card.jsx'
import { IconCheck } from '../../components/icons.jsx'

const importanceStyles = {
  Essential: 'bg-primary-soft text-primary',
  Important: 'bg-warning-soft text-warning',
  Supporting: 'bg-canvas text-ink-muted',
}

export default function RequiredCompetencies({ role }) {

  if (!role) {
    return (
      <Card className="p-5">
        <CardHeader
          eyebrow="Required competencies"
          title="Set a career goal to see requirements"
        />
        <p className="text-sm text-ink-muted mt-2">
          Once you save a career goal, its required skills and targets will show here.
        </p>
      </Card>
    )
  }
  return (
    <Card className="p-5">
      <CardHeader
        eyebrow="Required competencies"
        title={`What ${role.name} requires`}
      />
      <p className="text-sm text-ink-muted mt-2">
        These requirements become the target used by your competency and skill-gap views.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        {role.competencies.map((competency) => (
          <div
            key={competency.id}
            className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-surface-raised px-3.5 py-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                <IconCheck width={14} height={14} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{competency.name}</p>
                <p className="text-xs text-ink-faint mt-0.5">Target {competency.required}%</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${importanceStyles[competency.importance] ?? importanceStyles.Supporting
                }`}
            >
              {competency.importance}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
