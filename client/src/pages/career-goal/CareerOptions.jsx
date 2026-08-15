import { useMemo, useState } from 'react'
import Card, { CardHeader } from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { IconArrowRight, IconCheck } from '../../components/icons.jsx'
import { careerRoles } from '../../data/careerRoles.js'
import { useCareerGoal } from '../../context/CareerGoalContext.jsx'
import CareerOptionPreview from './CareerOptionPreview.jsx'

export default function CareerOptions() {
  const { careerGoal, saveCareerGoal } = useCareerGoal()
  const [selectedRole, setSelectedRole] = useState(null)
  const [savingRole, setSavingRole] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [success, setSuccess] = useState(false)

  const options = useMemo(
    () => careerRoles.filter((role) => role.name !== careerGoal?.role).slice(0, 4),
    [careerGoal?.role],
  )

  const setAsGoal = async () => {
    if (!selectedRole) return
    setSavingRole(true)
    setSaveError(null)
    setSuccess(false)
    try {
      await saveCareerGoal({
        role: selectedRole.name,
        level: careerGoal?.level ?? 'Entry Level',
        domain: selectedRole.domain,
        timeline: careerGoal?.timeline ?? '6 months',
      })
      setSelectedRole(null)
      setSuccess(true)
    } catch {
      setSaveError('We could not update your career goal. Please try again.')
    } finally {
      setSavingRole(false)
    }
  }

  return (
    <>
      <Card className="p-5">
        <CardHeader
          eyebrow="Explore"
          title="Other career options"
          action={
            <span className="text-xs text-ink-muted hidden sm:block">Explore before changing your goal</span>
          }
        />

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-success/20 bg-success-soft px-3 py-2.5 text-sm text-success" role="status">
            <IconCheck width={15} height={15} />
            Career goal updated successfully.
          </div>
        )}

        {saveError && (
          <p className="mt-4 rounded-[8px] border border-critical/20 bg-critical-soft px-3 py-2.5 text-sm text-critical" role="alert">
            {saveError}
          </p>
        )}

        {options.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {options.map((role) => (
              <div key={role.id} className="border border-border rounded-[10px] bg-surface-raised p-4">
                <p className="text-sm font-semibold text-ink">{role.name}</p>
                <p className="text-xs text-ink-muted mt-1">{role.domain}</p>
                <p className="text-xs text-ink-faint mt-3">{role.competencies.length} core competencies</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 px-0"
                  icon={IconArrowRight}
                  onClick={() => setSelectedRole(role)}
                >
                  Explore
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted mt-4">No additional career options available.</p>
        )}
      </Card>

      {selectedRole && (
        <CareerOptionPreview
          role={selectedRole}
          saving={savingRole}
          onClose={() => setSelectedRole(null)}
          onSetGoal={setAsGoal}
        />
      )}
    </>
  )
}
