import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { IconArrowRight, IconRefresh } from '../components/icons.jsx'
import { useAssessmentResult } from '../hooks/useAssessmentResult.js'
import { formatAssessmentDate, getAssessmentAvailability } from '../utils/assessmentUtils.js'
import { startAssessment, submitAssessment } from '../services/assessmentApi.js'

// Local flow state, separate from the "latest result" data useAssessmentResult
// already tracks. This only covers "am I actively taking a test right now".
function QuizFlow({ onFinished }) {
  const [phase, setPhase] = useState('idle') // idle -> building -> in_progress -> submitting -> done -> nothing_to_assess -> error
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({}) // { [question_id]: answer }
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  async function handleStart() {
    setPhase('building')
    setErrorMessage(null)
    try {
      const response = await startAssessment({ numSkills: 3, questionsPerSkill: 3 })
      if (response.detail) {
        // Engine had nothing worth testing right now (all relevant skills
        // either well-evidenced already, or in cooldown) - not an error.
        setErrorMessage(response.detail)
        setPhase('nothing_to_assess')
        return
      }
      setAttempt(response)
      setAnswers({})
      setPhase('in_progress')
    } catch (err) {
      setErrorMessage(err.message)
      setPhase('error')
    }
  }

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  async function handleSubmit() {
    setPhase('submitting')
    try {
      const answerList = attempt.questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id] ?? '',
      }))
      const submitted = await submitAssessment(attempt.id, answerList)
      setResult(submitted)
      setPhase('done')
      onFinished?.()
    } catch (err) {
      setErrorMessage(err.message)
      setPhase('error')
    }
  }

  if (phase === 'idle') {
    return (
      <Button variant="primary" size="sm" className="mt-5" icon={IconArrowRight} onClick={handleStart}>
        Take assessment
      </Button>
    )
  }

  if (phase === 'building') {
    return (
      <div className="mt-5 flex items-center gap-2 text-sm text-ink-muted">
        <LoadingSpinner /> Building your assessment…
      </div>
    )
  }

  if (phase === 'nothing_to_assess') {
    return (
      <div className="mt-5 rounded-[10px] border border-border bg-canvas px-4 py-3">
        <p className="text-sm font-medium text-ink">Nothing to assess right now</p>
        <p className="text-xs text-ink-muted mt-1">{errorMessage}</p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="mt-5 rounded-[10px] border border-critical bg-critical-soft px-4 py-3">
        <p className="text-sm font-medium text-critical">Something went wrong</p>
        <p className="text-xs text-ink-muted mt-1">{errorMessage}</p>
        <Button variant="secondary" size="sm" className="mt-3" icon={IconRefresh} onClick={handleStart}>
          Try again
        </Button>
      </div>
    )
  }

  if (phase === 'done' && result) {
    return (
      <div className="mt-5">
        <p className="font-display text-3xl font-semibold text-ink tabular">{result.overall_score}%</p>
        <p className="text-sm text-ink-muted mt-1">Overall score on this attempt</p>

        <div className="mt-4 space-y-2">
          {result.skill_results.map((r) => (
            <div key={r.skill} className="flex items-center justify-between text-sm border-b border-border pb-2">
              <span className="text-ink">{r.skill}</span>
              <span className="text-ink-muted tabular">
                {r.score}% ({r.correct_count}/{r.total_count})
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-muted mt-4">
          Your competency profile has been updated with this evidence.
        </p>
        <Button as={Link} to="/competency-profile" variant="secondary" size="sm" className="mt-4" icon={IconArrowRight}>
          View updated competency profile
        </Button>
      </div>
    )
  }

  // in_progress / submitting - render the quiz
  return (
    <div className="mt-5 space-y-6">
      {attempt.questions.map((q, idx) => (
        <div key={q.id} className="border-b border-border pb-4">
          <p className="text-xs text-ink-muted mb-1">{q.skill}</p>
          <p className="text-sm font-medium text-ink mb-3">
            {idx + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {(q.options ?? []).map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  checked={answers[q.id] === option}
                  onChange={() => handleAnswerChange(q.id, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <Button
        variant="primary"
        size="sm"
        onClick={handleSubmit}
        disabled={phase === 'submitting'}
      >
        {phase === 'submitting' ? 'Submitting…' : 'Submit answers'}
      </Button>
    </div>
  )
}

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
                  <QuizFlow onFinished={reload} />
                )}
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-sm text-ink-muted">No assessment has been completed yet.</p>
                <QuizFlow onFinished={reload} />
              </div>
            )}
          </>
        )}

        <div className="mt-6 pt-5 border-t border-border">
          <Button as={Link} to="/career-goal" variant="ghost" size="sm" className="mt-3">
            Back to Career Goal
          </Button>
        </div>
      </Card>
    </div>
  )
}
