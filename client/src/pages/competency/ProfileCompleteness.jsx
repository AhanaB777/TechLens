import Card, { CardHeader } from '../../components/Card.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { IconCheck, IconCircleDot } from '../../components/icons.jsx'

export default function ProfileCompleteness({ completeness }) {
  if (!completeness) return null

  return (
    <Card className="p-5">
      <CardHeader eyebrow="Profile completeness" />
      <div className="mt-3 max-w-xs">
        <ProgressBar value={completeness.score} trailing={`${completeness.score}%`} tone="primary" />
      </div>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {completeness.items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full shrink-0 ${
                item.done ? 'bg-success text-white' : 'bg-canvas text-ink-faint border border-border-strong'
              }`}
            >
              {item.done ? <IconCheck width={12} height={12} /> : <IconCircleDot width={10} height={10} />}
            </span>
            <span className={item.done ? 'text-ink' : 'text-ink-muted'}>{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
