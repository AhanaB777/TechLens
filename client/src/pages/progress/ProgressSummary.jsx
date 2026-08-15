import Card from '../../components/Card.jsx'

function SummaryStat({ eyebrow, value, sublabel }) {
  return (
    <div>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <p className="font-mono text-3xl font-semibold text-ink tabular">{value}</p>
      {sublabel && <p className="text-xs text-ink-muted mt-1">{sublabel}</p>}
    </div>
  )
}

export default function ProgressSummary({ readinessNow, readinessDeltaSinceStart, roadmap, averageGrowth }) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryStat
          eyebrow="Career readiness"
          value={readinessNow != null ? `${readinessNow}%` : '—'}
          sublabel={
            readinessDeltaSinceStart != null
              ? `${readinessDeltaSinceStart >= 0 ? '+' : ''}${readinessDeltaSinceStart}% since you started tracking`
              : 'Not enough history yet'
          }
        />
        <SummaryStat
          eyebrow="Roadmap completion"
          value={`${roadmap.overall}%`}
          sublabel={`${roadmap.counts.completed} / ${roadmap.counts.total} milestones`}
        />
        <SummaryStat
          eyebrow="Competency growth"
          value={averageGrowth != null ? `+${averageGrowth}%` : '—'}
          sublabel={
            averageGrowth != null ? 'Average across assessed competencies' : 'Not enough history yet'
          }
        />
      </div>
    </Card>
  )
}
