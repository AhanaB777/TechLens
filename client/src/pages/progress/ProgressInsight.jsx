import Card, { CardHeader } from '../../components/Card.jsx'

/**
 * Assembles a short interpretation purely from numbers already computed
 * upstream (progressApi.js) — every sentence maps to a real field, and
 * there's no claim of AI-generated analysis because there isn't any.
 */
export default function ProgressInsight({
  readinessDeltaSincePrevious,
  biggestImprovement,
  remainingPriorityAreas,
}) {
  const sentences = []

  if (readinessDeltaSincePrevious != null) {
    sentences.push(
      `Your career readiness has ${readinessDeltaSincePrevious >= 0 ? 'improved' : 'decreased'} by ${Math.abs(readinessDeltaSincePrevious)} points since your last assessment.`,
    )
  }

  if (biggestImprovement) {
    sentences.push(
      `Your strongest improvement has been ${biggestImprovement.name}, up ${biggestImprovement.delta} points.`,
    )
  }

  if (remainingPriorityAreas.length) {
    const names = remainingPriorityAreas.map((c) => c.name).join(' and ')
    sentences.push(`Your remaining priority ${remainingPriorityAreas.length === 1 ? 'area is' : 'areas are'} ${names}.`)
  }

  if (!sentences.length) return null

  return (
    <Card className="p-5">
      <CardHeader eyebrow="Your progress" />
      <p className="text-sm text-ink mt-2 leading-relaxed">{sentences.join(' ')}</p>
    </Card>
  )
}
