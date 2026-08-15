/**
 * Base surface primitive. Every dashboard section sits inside a Card so
 * spacing, radius, border, and hover behavior stay identical everywhere.
 */
export default function Card({
  children,
  className = '',
  interactive = false,
  as: Tag = 'div',
  ...rest
}) {
  return (
    <Tag
      className={`bg-surface border border-border rounded-lg shadow-card
        ${interactive ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''}
        ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ eyebrow, title, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        {title && <h3 className="text-base font-semibold text-ink">{title}</h3>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
