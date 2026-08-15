import { useState } from 'react'
import { useCompetencyProfile } from '../hooks/useCompetencyProfile.js'
import ProfileHero from './competency/ProfileHero.jsx'
import CompetencyBreakdown from './competency/CompetencyBreakdown.jsx'
import StrengthsAndImprovement from './competency/StrengthsAndImprovement.jsx'
import ProfileCompleteness from './competency/ProfileCompleteness.jsx'
import CompetencyDetailModal from './competency/CompetencyDetailModal.jsx'
import {
  CompetencyLoadingState,
  CompetencyErrorState,
  CompetencyEmptyState,
} from './competency/CompetencyStates.jsx'

export default function CompetencyProfile() {
  const { data, status, reload } = useCompetencyProfile()
  const [selectedCompetency, setSelectedCompetency] = useState(null)

  if (status === 'loading') return <CompetencyLoadingState />
  if (status === 'error') return <CompetencyErrorState onRetry={reload} />

  const hasData = data.competencies.length > 0

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Competency Profile</h1>
        <p className="text-ink-muted mt-1">Your demonstrated capabilities at a glance.</p>
      </div>

      {!hasData ? (
        <CompetencyEmptyState />
      ) : (
        <div className="space-y-6">
          <ProfileHero profile={data} />
          <StrengthsAndImprovement competencies={data.competencies} />
          <CompetencyBreakdown competencies={data.competencies} onViewDetails={setSelectedCompetency} />
          <ProfileCompleteness completeness={data.completeness} />
        </div>
      )}

      {selectedCompetency && (
        <CompetencyDetailModal
          competency={selectedCompetency}
          onClose={() => setSelectedCompetency(null)}
        />
      )}
    </>
  )
}
