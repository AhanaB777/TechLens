import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconGrid,
  IconTarget,
  IconLayers,
  IconGap,
  IconRoute,
  IconTrendUp,
  IconClose,
} from './icons.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
  { to: '/career-goal', label: 'Career Goal', icon: IconTarget },
  { to: '/competency-profile', label: 'Competency Profile', icon: IconLayers },
  // { to: '/skill-gaps', label: 'Skill Gaps', icon: IconGap },
  { to: '/roadmap', label: 'Roadmap', icon: IconRoute },
  { to: '/progress', label: 'Progress', icon: IconTrendUp },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors
            ${
              isActive
                ? 'bg-primary-soft text-primary'
                : 'text-ink-muted hover:bg-canvas hover:text-ink'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon width={18} height={18} className={isActive ? 'text-primary' : 'text-ink-faint'} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** Permanent desktop sidebar. */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="px-2 mb-8 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary text-white font-display text-sm font-semibold">
          T
        </span>
        <span className="font-display text-lg font-semibold text-ink">TechLens</span>
      </div>
      <NavItems />
    </aside>
  )
}

/** Mobile navigation drawer, controlled by DashboardLayout. */
export function MobileSidebar({ open, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="lg:hidden fixed inset-0 z-40">
      <button
        className="absolute inset-0 bg-ink/40"
        aria-label="Close navigation menu"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className="absolute inset-y-0 left-0 w-72 bg-surface px-4 py-6 shadow-card-hover flex flex-col animate-fade-up"
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary text-white font-display text-sm font-semibold">
              T
            </span>
            <span className="font-display text-lg font-semibold text-ink">TechLens</span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1.5 rounded-[8px] text-ink-muted hover:bg-canvas"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>
        <NavItems onNavigate={onClose} />
      </aside>
    </div>
  )
}
