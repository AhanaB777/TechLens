import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import SkillBar from '../../components/SkillBar.jsx'
import { IconArrowRight, IconLayers } from '../../components/icons.jsx'

export default function CompetencyOverview({ competencies }) {
  if (!competencies?.length) {
    return (
      <Card className="p-5">
        <CardHeader eyebrow="Competency snapshot" />
        <p className="text-sm text-ink-muted mt-2">
          Complete an assessment to start building your competency profile.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <CardHeader
        eyebrow="Your competency snapshot"
        action={<IconLayers width={18} height={18} className="text-ink-faint" />}
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {competencies.map((c) => (
          <SkillBar key={c.name} name={c.name} score={c.score} />
        ))}
      </div>
      <Link
        to="/competency-profile"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-5"
      >
        View full competency profile
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  )
}
