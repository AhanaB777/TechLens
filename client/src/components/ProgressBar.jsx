const TONE_FILL = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
}

/**
 * Generic linear progress bar. Purely presentational — value in, bar out.
 * `label` and `trailing` are optional so callers can attach context
 * (a name, a percentage) without this component knowing what a "skill" is.
 */
export default function ProgressBar({
  value,
  max = 100,
  tone = 'primary',
  label,
  trailing,
  size = 'md',
  showValue = false,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div>
      {(label || trailing || showValue) && (
        <div className="flex items-baseline justify-between mb-1.5">
          {label && <span className="text-sm text-ink">{label}</span>}
          {(trailing || showValue) && (
            <span className="text-sm font-mono tabular text-ink-muted">
              {trailing ?? `${Math.round(pct)}%`}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} rounded-full bg-canvas overflow-hidden`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={`${height} rounded-full ${TONE_FILL[tone]} animate-grow-bar`}
          style={{ '--bar-value': `${pct}%` }}
        />
      </div>
    </div>
  )
}
