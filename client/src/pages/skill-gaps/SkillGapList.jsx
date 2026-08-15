import { useMemo, useState } from 'react'
import { CardHeader } from '../../components/Card.jsx'
import SkillGapCard from './SkillGapCard.jsx'
import PillFilter from '../../components/PillFilter.jsx'

const STATUS_OPTIONS = ['Needs improvement', 'On track', 'Not assessed']

function matchesFilter(c, filter) {
  if (filter === 'All') return true
  if (filter === 'On track') return c.onTrack
  if (filter === 'Not assessed') return c.notAssessed
  if (filter === 'Needs improvement') return !c.onTrack && !c.notAssessed
  return true
}

export default function SkillGapList({ competencies }) {
  const [filter, setFilter] = useState('All')

  const visible = useMemo(
    () => competencies.filter((c) => matchesFilter(c, filter)),
    [competencies, filter],
  )

  return (
    <div>
      <CardHeader eyebrow="Competency gap analysis" className="mb-4" />

      <div className="mb-5">
        <PillFilter
          label="Filter by status"
          options={STATUS_OPTIONS}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-ink-muted">No competencies match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c) => (
            <SkillGapCard key={c.id} competency={c} />
          ))}
        </div>
      )}
    </div>
  )
}
