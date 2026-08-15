/**
 * Compact metric display: a title, a big mono value, and optional delta.
 * Generic enough to show a score, a count, or a duration — callers decide.
 */
export default function ScoreCard({ title, value, delta, deltaTone = 'success', icon: Icon }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-ink-muted mb-1.5">{title}</p>
        <p className="font-mono text-2xl font-semibold text-ink tabular">{value}</p>
        {delta && (
          <p
            className={`text-xs font-medium mt-1 ${
              deltaTone === 'success' ? 'text-success' : 'text-ink-muted'
            }`}
          >
            {delta}
          </p>
        )}
      </div>
      {Icon && (
        <div className="rounded-[10px] bg-primary-soft text-primary p-2">
          <Icon width={18} height={18} />
        </div>
      )}
    </div>
  )
}
