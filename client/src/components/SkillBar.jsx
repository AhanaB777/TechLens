import ProgressBar from './ProgressBar.jsx'
import { scoreToTone } from '../utils/scoreUtils.js'

/**
 * A single named competency with its score, rendered as a labeled bar.
 * Wraps ProgressBar with the "skill" semantics (name, score, tone-by-score).
 */
export default function SkillBar({ name, score, tone }) {
  return (
    <ProgressBar
      label={name}
      value={score}
      trailing={`${score}%`}
      tone={tone ?? scoreToTone(score)}
    />
  )
}
