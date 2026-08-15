import { IconCheck } from './icons.jsx'

/**
 * Marks a competency as backed by verifiable evidence (an assessment,
 * a project, a certification). Not used on the Dashboard yet — this is
 * the shared primitive the Competency Profile module (Part 3) will use.
 */
export default function EvidenceBadge({ label = 'Verified' }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft text-success px-2 py-0.5 text-xs font-medium">
      <IconCheck width={12} height={12} />
      {label}
    </span>
  )
}
