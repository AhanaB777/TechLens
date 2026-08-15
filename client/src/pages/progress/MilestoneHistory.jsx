import Card, { CardHeader } from '../../components/Card.jsx'
import { IconCheck } from '../../components/icons.jsx'
import { shortDate } from '../../utils/formatters.js'

export default function MilestoneHistory({ milestones }) {
  return (
    <Card className="p-5">
      <CardHeader eyebrow="Recent milestones" />
      {!milestones.length ? (
        <p className="text-sm text-ink-muted mt-2">
          Completed roadmap milestones will show up here.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {milestones.map((m) => (
            <li key={m.id} className="py-2.5 first:pt-0 flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
                <IconCheck width={13} height={13} />
              </span>
              <span className="text-sm text-ink flex-1">{m.title}</span>
              <span className="text-xs text-ink-faint shrink-0">Completed {shortDate(m.completedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
