import { IconBell, IconMenu, IconUser } from './icons.jsx'

/**
 * Top app bar. Kept deliberately light — branding lives in the sidebar,
 * so this only needs the mobile menu trigger, notifications, and profile.
 */
export default function Navbar({ onMenuClick, userName }) {
  const initial = userName?.trim()?.[0]?.toUpperCase() || '?'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 backdrop-blur px-4 lg:px-8 h-16 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 rounded-[8px] text-ink-muted hover:bg-canvas"
        >
          <IconMenu width={20} height={20} />
        </button>
        <span className="lg:hidden font-display text-base font-semibold text-ink">TechLens</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled
          aria-label="Notifications (coming soon)"
          title="Coming soon"
          className="p-2 rounded-[8px] text-ink-faint cursor-not-allowed opacity-60"
        >
          <IconBell width={19} height={19} />
        </button>
        <button
          disabled
          aria-label="Profile (coming soon)"
          title="Coming soon"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink-faint text-sm font-semibold cursor-not-allowed opacity-60"
        >
          {initial === '?' ? <IconUser width={16} height={16} /> : initial}
        </button>
      </div>
    </header>
  )
}
