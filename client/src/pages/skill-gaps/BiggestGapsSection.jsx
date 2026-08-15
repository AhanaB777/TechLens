import Card, { CardHeader } from '../../components/Card.jsx'

export default function BiggestGapsSection({ competencies }) {
  if (!competencies.length) return null

  return (
    <Card className="p-5">
      <CardHeader eyebrow="Your biggest gaps" />
      <ol className="mt-3 space-y-3">
        {competencies.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-mono font-medium text-ink-muted">
              {i + 1}
            </span>
            <span className="text-sm text-ink flex-1">{c.name}</span>
            <span className="font-mono text-sm font-medium text-critical tabular">-{c.gap}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}
