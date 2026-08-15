import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { IconArrowRight, IconCheck, IconTarget } from '../components/icons.jsx'
import { careerRoles, experienceLevels, timelineOptions, getCareerRole } from '../data/careerRoles.js'
import { useCareerGoal } from '../context/CareerGoalContext.jsx'
import GoalSummary from './career-goal/GoalSummary.jsx'
import CareerGoalForm from './career-goal/CareerGoalForm.jsx'
import RequiredCompetencies from './career-goal/RequiredCompetencies.jsx'
import AssessmentSummary from './career-goal/AssessmentSummary.jsx'
import CurrentSkills from './career-goal/CurrentSkills.jsx'
import CareerOptions from './career-goal/CareerOptions.jsx'

const domains = [...new Set(careerRoles.map((role) => role.domain))]

export default function CareerGoal() {
  const {
    careerGoal,
    careerGoals,
    activeGoalId,
    roleDefinition,
    status,
    error,
    saveCareerGoal,
    addCareerGoal,
    removeCareerGoal,
    setActiveCareerGoal,
    reloadCareerGoals,
  } = useCareerGoal()

  const [editingGoalId, setEditingGoalId] = useState(null)
  const [addingGoal, setAddingGoal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState(null)

  const editingGoal = careerGoals.find((goal) => goal.id === editingGoalId) ?? null

  const roleOptions = useMemo(
    () => careerRoles.filter((role) => {
      if (role.domain !== form?.domain) return false
      const isCurrentEditingRole = editingGoal?.role === role.name
      const alreadyUsed = careerGoals.some((goal) => goal.role === role.name)
      return isCurrentEditingRole || !alreadyUsed
    }),
    [form?.domain, careerGoals, editingGoal?.role],
  )

  const startEditing = (goal = careerGoal) => {
    if (!goal) return
    setSaveError(null)
    setSuccess(false)
    setAddingGoal(false)
    setEditingGoalId(goal.id)
    setForm({
      role: goal.role,
      level: goal.level ?? experienceLevels[0],
      domain: goal.domain ?? careerRoles[0].domain,
      timeline: goal.timeline ?? timelineOptions[1],
    })
  }

  const startAdding = () => {
    setSaveError(null)
    setSuccess(false)
    setEditingGoalId(null)
    setAddingGoal(true)
    const firstAvailableRole = careerRoles.find((role) => !careerGoals.some((goal) => goal.role === role.name)) ?? careerRoles[0]
    setForm({
      role: firstAvailableRole.name,
      level: experienceLevels[0],
      domain: firstAvailableRole.domain,
      timeline: timelineOptions[1],
    })
  }

  const updateForm = (changes) => {
    setSuccess(false)
    setSaveError(null)
    setForm((current) => {
      const next = { ...current, ...changes }
      if (changes.domain) {
        const firstRole = careerRoles.find(
          (role) => role.domain === changes.domain && !careerGoals.some((goal) => goal.role === role.name && goal.id !== editingGoalId),
        )
        if (firstRole) next.role = firstRole.name
      }
      if (changes.role) {
        const role = getCareerRole(changes.role)
        next.domain = role.domain
      }
      return next
    })
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form) return
    setSaving(true)
    setSaveError(null)
    setSuccess(false)
    try {
      if (addingGoal) {
        await addCareerGoal(form)
      } else {
        await saveCareerGoal(form, editingGoalId)
      }
      setEditingGoalId(null)
      setAddingGoal(false)
      setForm(null)
      setSuccess(true)
    } catch (saveException) {
      setSaveError(saveException?.message || 'We could not save your career goal. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingGoalId(null)
    setAddingGoal(false)
    setForm(null)
    setSaveError(null)
    setSuccess(false)
  }

  const handleRemove = async (goal) => {
    const confirmed = window.confirm(`Remove ${goal.role} from your career goals?`)
    if (!confirmed) return
    try {
      await removeCareerGoal(goal.id)
      setSuccess(true)
      setSaveError(null)
    } catch (removeError) {
      setSaveError(removeError?.message || 'We could not remove that career goal.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[420px] flex items-center justify-center" aria-live="polite">
        <LoadingSpinner />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm font-semibold text-ink">We couldn't load your career goals.</p>
        <p className="text-sm text-ink-muted mt-1">{error ?? 'Please try again.'}</p>
        <Button className="mt-5" size="sm" onClick={reloadCareerGoals}>Try again</Button>
      </Card>
    )
  }

  const hasGoals = careerGoals.length > 0
  const activeRoleDefinition = roleDefinition

  return (
    <div className="space-y-6">
      <div className="mb-1">
        <p className="eyebrow mb-1.5">Career direction</p>
        <h1 className="text-2xl font-semibold">Where do you want to go?</h1>
        <p className="text-ink-muted mt-1 max-w-2xl">
          Keep up to two career directions in TechLens. Your primary goal drives the competency journey across the app.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-[10px] border border-success/20 bg-success-soft px-4 py-3 text-sm text-success" role="status">
          <IconCheck width={16} height={16} />
          Career goals updated successfully.
        </div>
      )}

      {saveError && (
        <div className="rounded-[10px] border border-critical/20 bg-critical-soft px-4 py-3 text-sm text-critical" role="alert">
          {saveError}
        </div>
      )}

      {!hasGoals ? (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <IconTarget width={22} height={22} />
          </div>
          <h2 className="font-display text-xl font-semibold mt-4">Where do you want to go?</h2>
          <p className="text-sm text-ink-muted mt-2 max-w-md mx-auto">
            Your career goal is the starting point for your TechLens competency journey.
          </p>
          <Button className="mt-5" size="sm" onClick={startAdding}>Set your career goal</Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {careerGoals.map((goal) => (
              <GoalSummary
                key={goal.id}
                careerGoal={goal}
                primary={goal.id === activeGoalId}
                onEdit={() => startEditing(goal)}
                onSelect={() => setActiveCareerGoal(goal.id)}
                onRemove={careerGoals.length > 1 ? () => handleRemove(goal) : null}
              />
            ))}
          </div>

          {careerGoals.length < 2 && !editingGoalId && !addingGoal && (
            <Card className="p-5 border-dashed">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">Add a second career goal</p>
                  <p className="text-sm text-ink-muted mt-1">Keep another career direction in view without changing your primary goal.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={startAdding}>+ Add career goal</Button>
              </div>
            </Card>
          )}

          {(editingGoalId || addingGoal) && (
            <Card className="p-6">
              <div className="mb-5">
                <p className="eyebrow mb-1">{addingGoal ? 'Add career goal' : 'Edit career goal'}</p>
                <h2 className="font-display text-xl font-semibold">
                  {addingGoal ? 'Choose another target you want to keep open.' : `Update ${editingGoal?.role ?? 'career goal'}.`}
                </h2>
              </div>
              <CareerGoalForm
                value={form}
                roleOptions={roleOptions}
                domains={domains}
                experienceLevels={experienceLevels}
                timelineOptions={timelineOptions}
                saving={saving}
                onChange={updateForm}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-5">
              <AssessmentSummary />
              <CurrentSkills />
            </div>
            <RequiredCompetencies role={activeRoleDefinition} />
          </div>

          <CareerOptions />

          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="eyebrow mb-1">Your competency journey</p>
                <p className="text-sm text-ink-muted">The primary goal is the career context used by your competency, skill-gap, roadmap, and progress modules.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button as={Link} to="/competency-profile" variant="secondary" size="sm" icon={IconArrowRight}>
                  Competency profile
                </Button>
                <Button as={Link} to="/skill-gaps" variant="ghost" size="sm" icon={IconArrowRight}>
                  Skill gaps
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
