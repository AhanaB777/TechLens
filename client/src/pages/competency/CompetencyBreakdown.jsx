import { useMemo, useState } from 'react'
import { CardHeader } from '../../components/Card.jsx'
import CompetencyCard from './CompetencyCard.jsx'
import PillFilter from '../../components/PillFilter.jsx'
import { groupByCategory } from '../../utils/competencyUtils.js'

export default function CompetencyBreakdown({ competencies, onViewDetails }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(
    () => [...new Set(competencies.map((c) => c.category))],
    [competencies],
  )

  const visible = useMemo(
    () =>
      activeCategory === 'All'
        ? competencies
        : competencies.filter((c) => c.category === activeCategory),
    [competencies, activeCategory],
  )

  const grouped = useMemo(() => groupByCategory(visible), [visible])

  return (
    <div>
      <CardHeader eyebrow="Competency breakdown" className="mb-4" />

      {categories.length > 1 && (
        <div className="mb-5">
          <PillFilter
            label="Filter competencies by category"
            options={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      )}

      <div className="space-y-6">
        {grouped.map(({ category, items }) => (
          <div key={category}>
            {activeCategory === 'All' && (
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-3">
                {category}
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((c) => (
                <CompetencyCard key={c.id} competency={c} onViewDetails={onViewDetails} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
