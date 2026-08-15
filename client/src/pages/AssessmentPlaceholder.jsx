import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { IconArrowRight, IconRefresh } from '../components/icons.jsx'
import { useAssessmentResult } from '../hooks/useAssessmentResult.js'
import { formatAssessmentDate, getAssessmentAvailability } from '../utils/assessmentUtils.js'

export default function AssessmentPlaceholder() {
  const { data, status, reload } = useAssessmentResult()
  const availability = getAssessmentAvailability(data)

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="eyebrow mb-1.5">Assessment</p>
        <h1 className="text-2xl font-semibold">Assessment</h1>
        <p className="text-ink-muted mt-1">Assessment access and your latest result.</p>
      </div>

      <Card className="p-6">
        {status === 'loading' && (
          <div className="min-h-24 flex items-center justify-center" aria-live="polite">
            <LoadingSpinner />
          </div>
        )}

        {status === 'error' && (
          <div>
            <h2 className="text-base font-semibold text-ink">Assessment result unavailable</h2>
            <p className="text-sm text-ink-muted mt-2">We could not load your latest assessment result.</p>
            <Button variant="secondary" size="sm" className="mt-5" onClick={reload} icon={IconRefresh}>Try again</Button>
          </div>
        )}

        {status === 'success' && (
          <>
            <h2 className="text-base font-semibold text-ink">Latest assessment</h2>
            {data?.completed ? (
              <div className="mt-5">
                <p className="font-display text-4xl font-semibold tracking-tight text-ink tabular">
                  {data.score} <span className="text-lg font-medium text-ink-muted">/ {data.maxScore}</span>
                </p>
                <p className="text-sm text-ink-muted mt-1">
                  Completed{data.completedAt ? ` on ${formatAssessmentDate(new Date(`${data.completedAt}T00:00:00`))}` : ''}
                </p>

                {!availability.canTake ? (
                  <div className="mt-5 rounded-[10px] border border-border bg-canvas px-4 py-3" role="status">
                    <p className="text-sm font-medium text-ink">Retake not available yet</p>
                    <p className="text-xs text-ink-muted mt-1">
                      You can take the assessment again on {formatAssessmentDate(availability.nextAvailableDate)} ({availability.daysRemaining} {availability.daysRemaining === 1 ? 'day' : 'days'} remaining).
                    </p>
                  </div>
                ) : (
                  <Button as={Link} to="/assessment" variant="secondary" size="sm" className="mt-5" icon={IconArrowRight}>
                    Retake assessment
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-sm text-ink-muted">No assessment has been completed yet.</p>
                <Button as={Link} to="/assessment" variant="primary" size="sm" className="mt-5" icon={IconArrowRight}>
                  Take assessment
                </Button>
              </div>
            )}
          </>
        )}

        <div className="mt-6 pt-5 border-t border-border">
          <p className="text-xs text-ink-muted">
            The question-and-answer assessment flow is not connected in this frontend build yet. This page is the integration point for the future assessment module.
          </p>
          <Button as={Link} to="/career-goal" variant="ghost" size="sm" className="mt-3">
            Back to Career Goal
          </Button>
        </div>
      </Card>
    </div>
  )
}
