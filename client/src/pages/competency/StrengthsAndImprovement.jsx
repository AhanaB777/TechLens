import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../components/Card.jsx'
import SkillBar from '../../components/SkillBar.jsx'
import { IconArrowRight } from '../../components/icons.jsx'
import { topStrengths, topImprovementAreas } from '../../utils/competencyUtils.js'

export default function StrengthsAndImprovement({ competencies }) {
  const strengths = topStrengths(competencies)
  const improvements = topImprovementAreas(competencies)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <CardHeader eyebrow="Your strengths" />
        <div className="mt-4 space-y-4">
          {strengths.map((c) => (
            <SkillBar key={c.id} name={c.name} score={c.score} tone="success" />
          ))}
        </div>
      </Card>

      <Card className="p-5 flex flex-col">
        <CardHeader eyebrow="Areas to improve" />
        <div className="mt-4 space-y-4 flex-1">
          {improvements.map((c) => (
            <SkillBar key={c.id} name={c.name} score={c.score} tone="warning" />
          ))}
        </div>
        <Link
          to="/skill-gaps"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover mt-4"
        >
          View skill gaps
          <IconArrowRight width={14} height={14} />
        </Link>
      </Card>
    </div>
  )
}
