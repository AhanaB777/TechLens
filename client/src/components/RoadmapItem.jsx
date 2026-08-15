import { IconCheck, IconCircleDot } from './icons.jsx'

const STATUS_STYLES = {
  done: { wrap: 'bg-success text-white', label: 'text-ink-muted line-through' },
  current: { wrap: 'bg-primary text-white', label: 'text-ink font-medium' },
  upcoming: { wrap: 'bg-canvas text-ink-faint border border-border-strong', label: 'text-ink-muted' },
}

/**
 * A single roadmap step. status: 'done' | 'current' | 'upcoming'.
 * Used compactly on the Dashboard and will be reused, full-size, on the
 * dedicated Roadmap page.
 */
export default function RoadmapItem({ name, status = 'upcoming' }) {
  const styles = STATUS_STYLES[status]
  return (
    <div className="flex items-center gap-2.5">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full shrink-0 ${styles.wrap}`}>
        {status === 'done' ? (
          <IconCheck width={12} height={12} />
        ) : status === 'current' ? (
          <IconCircleDot width={12} height={12} />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </span>
      <span className={`text-sm ${styles.label}`}>{name}</span>
    </div>
  )
}
