import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import { IconArrowRight } from '../../components/icons.jsx'

export default function CompetencyGrowth({ growth }) {
  if (!growth.length) {
    return (
      <Card className="p-5">
        <CardHeader eyebrow="Competency growth" />
        <p className="text-sm text-ink-muted mt-2">
          Growth appears here once a competency has been assessed more than once.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <CardHeader eyebrow="Competency growth" />
      <div className="mt-4 divide-y divide-border">
        {growth.map((g) => (
          <div key={g.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-ink">{g.name}</span>
            <span className="font-mono text-sm tabular text-ink-muted shrink-0">
              {g.previousScore} → <span className="text-ink font-medium">{g.currentScore}</span>{' '}
              <span className="text-success font-medium">+{g.delta}</span>
            </span>
          </div>
        ))}
      </div>
      <Link
        to="/competency-profile"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-4"
      >
        View competency profile
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
