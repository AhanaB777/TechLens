import { timeOfDayGreeting } from '../../utils/formatters.js'

export default function DashboardHeader({ userName, targetRole, experienceLevel }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">
        {timeOfDayGreeting()}, {userName || 'there'} 👋
      </h1>
      <p className="text-ink-muted mt-1">
        Here's your career readiness snapshot
        {targetRole && (
          <>
            {' — '}
            <span className="text-ink font-medium">{targetRole}</span>
            {experienceLevel && ` · ${experienceLevel}`}
          </>
        )}
        .
      </p>
    </div>
  )
}
