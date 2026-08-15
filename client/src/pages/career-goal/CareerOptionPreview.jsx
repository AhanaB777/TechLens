import Button from '../../components/Button.jsx'
import { IconArrowRight, IconClose } from '../../components/icons.jsx'

export default function CareerOptionPreview({ role, saving, onClose, onSetGoal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="presentation">
      <button
        type="button"
        aria-label="Close career preview"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-preview-title"
        className="relative w-full max-w-lg rounded-[12px] border border-border bg-surface shadow-card-hover p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-1.5">Career preview</p>
            <h2 id="career-preview-title" className="font-display text-xl font-semibold text-ink">
              {role.name}
            </h2>
            <p className="text-sm text-ink-muted mt-1">{role.domain}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] text-ink-muted hover:bg-surface-raised hover:text-ink"
            onClick={onClose}
          >
            <IconClose width={17} height={17} />
          </button>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-sm font-medium text-ink">Required competencies</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {role.competencies.map((competency) => (
              <span key={competency.id} className="rounded-[7px] border border-border bg-surface-raised px-2.5 py-1.5 text-xs text-ink">
                {competency.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>
            Keep current goal
          </Button>
          <Button size="sm" onClick={onSetGoal} disabled={saving} icon={IconArrowRight}>
            {saving ? 'Updating…' : 'Set as career goal'}
          </Button>
        </div>
      </section>
    </div>
  )
}
