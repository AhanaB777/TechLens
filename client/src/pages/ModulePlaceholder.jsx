import Card from '../components/Card.jsx'

/**
 * Placeholder for a module that isn't built yet. Exists so sidebar
 * navigation works end-to-end during Part 1 — the real page replaces
 * this file entirely in its own part.
 */
export default function ModulePlaceholder({ title, question }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">{title}</h1>
      <p className="text-ink-muted mb-6">{question}</p>
      <Card className="p-10 text-center">
        <p className="text-sm text-ink-muted">
          This module is coming in a later part of the TechLens build.
        </p>
      </Card>
    </div>
  )
}
