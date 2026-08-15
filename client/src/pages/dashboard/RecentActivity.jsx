import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import { IconCheck, IconArrowUp, IconArrowRight, IconTrendUp } from '../../components/icons.jsx'
import { relativeTime } from '../../utils/formatters.js'

const TYPE_ICON = {
  completed: { Icon: IconCheck, tone: 'text-success bg-success-soft' },
  improved: { Icon: IconArrowUp, tone: 'text-primary bg-primary-soft' },
}

export default function RecentActivity({ activity }) {
  return (
    <Card className="p-5">
      <CardHeader
        eyebrow="Recent activity"
        action={<IconTrendUp width={18} height={18} className="text-ink-faint" />}
      />
      {!activity?.length ? (
        <p className="text-sm text-ink-muted mt-2">
          Your recent assessments and roadmap milestones will show up here.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {activity.map((item) => {
            const { Icon, tone } = TYPE_ICON[item.type] ?? TYPE_ICON.completed
            return (
              <li key={item.id} className="py-3 first:pt-1 flex items-start gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone}`}>
                  <Icon width={13} height={13} />
                </span>
                <div>
                  <p className="text-sm text-ink">{item.text}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{relativeTime(item.timestamp)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <Link
        to="/progress"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-4"
      >
        View full progress
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
