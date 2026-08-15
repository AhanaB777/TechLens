import Card, { CardHeader } from '../../components/Card.jsx'
import { IconCheck } from '../../components/icons.jsx'

export default function OnTrackSection({ competencies }) {
  if (!competencies.length) return null

  return (
    <Card className="p-5">
      <CardHeader eyebrow="You're on track" />
      <ul className="mt-3 space-y-3">
        {competencies.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white shrink-0">
                <IconCheck width={12} height={12} />
              </span>
              {c.name}
            </span>
            <span className="font-mono text-sm text-ink-muted tabular">
              {c.current} / {c.required}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
