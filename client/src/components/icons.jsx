// Small, dependency-free icon set used across the TechLens shell.
// Kept local (rather than pulling every icon from a library) so the
// design foundation has zero risk of an icon-name mismatch. Swap for
// lucide-react one-for-one later if the team prefers.

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconGrid(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function IconTarget(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function IconLayers(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 3.5 8 12 12.5 20.5 8Z" />
      <path d="M3.5 12.5 12 17l8.5-4.5" />
      <path d="M3.5 17 12 21.5 20.5 17" />
    </svg>
  )
}

export function IconGap(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 19V9" />
      <path d="M12 19V5" />
      <path d="M20 19v-6" />
      <path d="M2.5 19h19" />
    </svg>
  )
}

export function IconRoute(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M5 8v3a4 4 0 0 0 4 4h6a4 4 0 0 1 4 4" />
    </svg>
  )
}

export function IconTrendUp(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  )
}

export function IconBell(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12.5 6 8.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 6.5h17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 17.5h17" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l14 14" />
      <path d="M19 5 5 19" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5l5 5L20 6.5" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15" />
      <path d="M13 5.5 19.5 12 13 18.5" />
    </svg>
  )
}

export function IconArrowUp(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  )
}

export function IconCircleDot(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconAlert(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 9v4.5" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
      <path d="M10.6 3.9 2.9 18a1.6 1.6 0 0 0 1.4 2.4h15.4a1.6 1.6 0 0 0 1.4-2.4L13.4 3.9a1.6 1.6 0 0 0-2.8 0Z" />
    </svg>
  )
}

export function IconRefresh(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v5h-5" />
    </svg>
  )
}

export function IconUser(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}
