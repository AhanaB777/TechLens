/**
 * Generic pill-style filter bar. Not tied to "category" specifically —
 * used for category filters, status filters, or any small option set
 * where a horizontal pill row beats a dropdown. `allLabel` lets callers
 * customize the "show everything" option's label.
 */
export default function PillFilter({ label, options, active, onChange, allLabel = 'All' }) {
  const allOptions = [allLabel, ...options]

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
    >
      {allOptions.map((option) => {
        const isActive = active === option
        return (
          <button
            key={option}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap
              ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-ink-muted hover:border-border-strong hover:text-ink'
              }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
