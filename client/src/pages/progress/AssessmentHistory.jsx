import Card, { CardHeader } from '../../components/Card.jsx'
import { shortDate } from '../../utils/formatters.js'

export default function AssessmentHistory({ assessments }) {
  return (
    <Card className="p-5">
      <CardHeader eyebrow="Recent assessments" />
      {!assessments.length ? (
        <p className="text-sm text-ink-muted mt-2">Completed assessments will show up here.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {assessments.map((a) => (
            <li key={a.name} className="py-2.5 first:pt-0 flex items-center justify-between gap-3">
              <span className="text-sm text-ink">{a.name}</span>
              <span className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm font-medium text-ink tabular">{a.score}%</span>
                <span className="text-xs text-ink-faint">{shortDate(a.date)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
