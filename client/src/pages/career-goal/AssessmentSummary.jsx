import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { IconArrowRight, IconRefresh } from '../../components/icons.jsx'
import { useAssessmentResult } from '../../hooks/useAssessmentResult.js'
import { formatAssessmentDate, getAssessmentAvailability } from '../../utils/assessmentUtils.js'

export default function AssessmentSummary() {
  const { data, status, reload } = useAssessmentResult()
  const availability = getAssessmentAvailability(data)

  return (
    <Card className="p-5">
      <CardHeader eyebrow="Assessment" title="Latest assessment" />

      {status === 'loading' && (
        <div className="min-h-20 flex items-center" aria-live="polite">
          <LoadingSpinner />
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4">
          <p className="text-sm text-ink-muted">Assessment result could not be loaded.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={reload} icon={IconRefresh}>
            Try again
          </Button>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {data?.completed ? (
                <>
                  <p className="font-display text-3xl font-semibold tracking-tight text-ink tabular">
                    {data.score} <span className="text-base font-medium text-ink-muted">/ {data.maxScore}</span>
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    Completed{data.completedAt ? ` on ${formatAssessmentDate(new Date(`${data.completedAt}T00:00:00`))}` : ''}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-medium text-ink">Not completed yet</p>
                  <p className="text-xs text-ink-muted mt-1">Take the assessment to establish your baseline.</p>
                </>
              )}
            </div>

            {availability.canTake ? (
              <Button
                as={Link}
                to="/assessment"
                variant={data?.completed ? 'secondary' : 'primary'}
                size="sm"
                icon={IconArrowRight}
              >
                {data?.completed ? 'Retake assessment' : 'Take assessment'}
              </Button>
            ) : (
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-ink">Retake available in {availability.daysRemaining} {availability.daysRemaining === 1 ? 'day' : 'days'}</p>
                <p className="text-xs text-ink-muted mt-1">
                  You can take the assessment again on {formatAssessmentDate(availability.nextAvailableDate)}.
                </p>
              </div>
            )}
          </div>

          {!availability.canTake && (
            <div className="rounded-[10px] border border-border bg-canvas px-3.5 py-3 text-xs text-ink-muted" role="status">
              Assessments can be retaken once every 10 days. Your current score remains available until then.
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
