import Card, { CardHeader } from '../../components/Card.jsx'
import ReadinessScore from '../../components/ReadinessScore.jsx'
import { readinessStatus } from '../../utils/scoreUtils.js'

export default function ReadinessCard({ readiness }) {
  return (
    <Card className="p-5 flex flex-col items-center h-full">
      <CardHeader eyebrow="Career readiness" className="self-start w-full" />
      <div className="mt-2">
        <ReadinessScore
          score={readiness.score}
          previousScore={readiness.previousScore}
          statusLabel={readinessStatus(readiness.score)}
        />
      </div>
    </Card>
  )
}
