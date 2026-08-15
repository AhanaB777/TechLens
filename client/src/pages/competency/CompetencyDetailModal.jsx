import { useEffect, useRef } from 'react'
import ProgressBar from '../../components/ProgressBar.jsx'
import SkillBadge from '../../components/SkillBadge.jsx'
import { IconClose } from '../../components/icons.jsx'
import { statusToTone, scoreToTone, recencyLabel, trendDelta } from '../../utils/scoreUtils.js'

export default function CompetencyDetailModal({ competency, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
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
  }, [onClose])

  if (!competency) return null

  const hasScore = competency.score != null
  const delta = competency.trend?.available ? trendDelta(competency.trend.history) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button className="absolute inset-0 bg-ink/40" aria-label="Close details" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="competency-detail-title"
        className="relative w-full sm:max-w-md bg-surface rounded-t-xl sm:rounded-xl shadow-card-hover
          max-h-[85vh] overflow-y-auto p-6 animate-fade-up"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="competency-detail-title" className="font-display text-lg font-semibold text-ink">
              {competency.name}
            </h2>
            <p className="text-xs text-ink-faint mt-0.5">{competency.category}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close details"
            className="p-1.5 rounded-[8px] text-ink-muted hover:bg-canvas shrink-0"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <span className="font-mono text-3xl font-semibold text-ink tabular">
            {hasScore ? `${competency.score}%` : '—'}
          </span>
          <SkillBadge tone={statusToTone(competency.status)}>{competency.status}</SkillBadge>
        </div>

        {hasScore && (
          <div className="mt-3">
            <ProgressBar value={competency.score} tone={scoreToTone(competency.score)} />
          </div>
        )}

        {competency.trend?.available && (
          <p className="text-sm text-ink-muted mt-3">
            <span className="font-mono tabular">{competency.trend.history.join(' → ')}</span>
            {delta != null && (
              <span className={delta >= 0 ? 'text-success font-medium' : 'text-critical font-medium'}>
                {' '}
                ({delta >= 0 ? '+' : ''}
                {delta} points)
              </span>
            )}
          </p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
          <div>
            <p className="text-xs text-ink-muted">Projects</p>
            <p className="font-mono text-lg font-medium text-ink tabular mt-0.5">
              {competency.evidence.projects}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Assessments</p>
            <p className="font-mono text-lg font-medium text-ink tabular mt-0.5">
              {competency.evidence.assessments}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Certifications</p>
            <p className="font-mono text-lg font-medium text-ink tabular mt-0.5">
              {competency.evidence.certifications}
            </p>
          </div>
        </div>

        {competency.strengths?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
              Strengths
            </p>
            <ul className="space-y-1.5">
              {competency.strengths.map((s) => (
                <li key={s} className="text-sm text-ink flex items-start gap-2">
                  <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-ink-faint mt-5 pt-5 border-t border-border">
          Last assessed {recencyLabel(competency.lastAssessed)}
        </p>
      </div>
    </div>
  )
}
