import Button from '../../components/Button.jsx'

export default function CareerGoalForm({
  value,
  roleOptions,
  domains,
  experienceLevels,
  timelineOptions,
  saving,
  onChange,
  onSave,
  onCancel,
}) {
  const inputClass =
    'mt-1.5 w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'

  return (
    <form onSubmit={onSave} className="space-y-5" noValidate>
      <div>
        <label htmlFor="career-domain" className="text-sm font-medium text-ink">
          Career Domain
        </label>
        <select
          id="career-domain"
          value={value.domain}
          onChange={(event) => onChange({ domain: event.target.value })}
          className={inputClass}
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="target-role" className="text-sm font-medium text-ink">
          Target Role
        </label>
        <select
          id="target-role"
          value={value.role}
          onChange={(event) => onChange({ role: event.target.value })}
          className={inputClass}
        >
          {roleOptions.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="experience-level" className="text-sm font-medium text-ink">
            Experience Level
          </label>
          <select
            id="experience-level"
            value={value.level}
            onChange={(event) => onChange({ level: event.target.value })}
            className={inputClass}
          >
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="target-timeline" className="text-sm font-medium text-ink">
            Target Timeline
          </label>
          <select
            id="target-timeline"
            value={value.timeline}
            onChange={(event) => onChange({ timeline: event.target.value })}
            className={inputClass}
          >
            {timelineOptions.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save career goal'}
        </Button>
      </div>
    </form>
  )
}
