import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import SkillBadge from '../../components/SkillBadge.jsx'
import { IconArrowRight, IconGap } from '../../components/icons.jsx'
import { gapToPriority } from '../../utils/scoreUtils.js'

export default function SkillGapSummary({ skillGaps }) {
  if (!skillGaps?.length) {
    return (
      <Card className="p-5 h-full">
        <CardHeader eyebrow="Skill gaps" />
        <p className="text-sm text-ink-muted mt-2">
          No skill gaps identified yet — set a career goal to compare your competencies
          against your target role.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-5 flex flex-col h-full">
      <CardHeader
        eyebrow="Skill gaps"
        action={<IconGap width={18} height={18} className="text-ink-faint" />}
      />
      <ul className="mt-3 flex-1 divide-y divide-border">
        {skillGaps.map((g) => {
          const priority = gapToPriority(g.gap)
          return (
            <li key={g.name} className="py-3 first:pt-1 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{g.name}</p>
                <p className="text-xs text-ink-muted mt-0.5 font-mono tabular">
                  {g.current} → {g.target}{' '}
                  <span className="font-body text-ink-faint">({g.gap} pt gap)</span>
                </p>
              </div>
              <SkillBadge tone={priority.tone}>{priority.label}</SkillBadge>
            </li>
          )
        })}
      </ul>
      <Link
        to="/skill-gaps"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-2"
      >
        View all skill gaps
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
