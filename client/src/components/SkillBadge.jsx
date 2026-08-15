const TONE_CLASSES = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  critical: 'bg-critical-soft text-critical',
  neutral: 'bg-canvas text-ink-muted',
}

/**
 * Compact pill for a status/priority/skill label. Never the sole
 * indicator of severity — always pair with text (see priority labels).
 */
export default function SkillBadge({ children, tone = 'neutral', icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {Icon && <Icon width={12} height={12} />}
      {children}
    </span>
  )
}
