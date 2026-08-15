import ProgressBar from '../../components/ProgressBar.jsx'
import SkillBadge from '../../components/SkillBadge.jsx'
import { IconCheck } from '../../components/icons.jsx'
import { taskProgress } from '../../utils/roadmapUtils.js'

const STATUS_TONE = { Completed: 'success', 'In Progress': 'primary', Upcoming: 'neutral' }

/**
 * Uses native <details>/<summary> for expand/collapse — keyboard and
 * screen-reader accessible with no custom ARIA bookkeeping needed.
 */
export default function RoadmapMilestone({ milestone, defaultOpen, onToggleTask }) {
  const progress = taskProgress(milestone.tasks)

  return (
    <details
      id={`milestone-${milestone.id}`}
      open={defaultOpen}
      className="rounded-lg border border-border bg-surface open:shadow-card scroll-mt-6"
    >
      <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium
              ${
                milestone.status === 'Completed'
                  ? 'bg-success text-white'
                  : milestone.status === 'In Progress'
                    ? 'bg-primary text-white'
                    : 'bg-canvas text-ink-faint border border-border-strong'
              }`}
          >
            {milestone.status === 'Completed' ? <IconCheck width={13} height={13} /> : ''}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{milestone.title}</p>
            <p className="text-xs text-ink-faint mt-0.5">{milestone.phaseTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {milestone.priority && milestone.status !== 'Completed' && (
            <SkillBadge tone={milestone.priority.tone}>{milestone.priority.label}</SkillBadge>
          )}
          <SkillBadge tone={STATUS_TONE[milestone.status]}>{milestone.status}</SkillBadge>
        </div>
      </summary>

      <div className="px-4 pb-4">
        <ProgressBar value={progress} trailing={`${progress}%`} tone="primary" size="sm" />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-ink-muted">
          {milestone.skills?.length > 0 && <span>Skills: {milestone.skills.join(', ')}</span>}
          {milestone.estimatedEffort && <span>Estimated {milestone.estimatedEffort}</span>}
        </div>

        {milestone.whyOnRoadmap && (
          <p className="text-xs text-ink-muted mt-3 pt-3 border-t border-border">
            {milestone.whyOnRoadmap}
          </p>
        )}

        <ul className="mt-3 pt-3 border-t border-border space-y-2.5">
          {milestone.tasks.map((task) => (
            <li key={task.id}>
              <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(milestone.id, task.id)}
                  className="mt-0.5 h-4 w-4 rounded border-border-strong text-primary focus-visible:outline-primary shrink-0"
                />
                <span className={task.completed ? 'text-ink-muted line-through' : 'text-ink'}>
                  {task.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
