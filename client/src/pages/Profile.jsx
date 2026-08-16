import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../components/Card'
import SkillBadge from '../components/SkillBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMyProfile } from '../services/profileApi.js'
import { getResumes } from '../services/resumeApi.js'

function Section({ title, children, empty = 'Nothing extracted yet.' }) {
  return (
    <Card className="p-5">
      <CardHeader title={title} />
      <div className="mt-4">{children || <p className="text-sm text-ink-muted">{empty}</p>}</div>
    </Card>
  )
}

function ChipList({ items }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full border border-border bg-canvas px-3 py-1 text-xs font-medium text-ink"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function ListItems({ items }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-ink">
          {typeof item === 'string' ? item : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  )
}

const STATUS_TONE = { completed: 'success', processing: 'warning', failed: 'critical', pending: 'neutral' }

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [resume, setResume] = useState(null)
  const [status, setStatus] = useState('loading')
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([getMyProfile(), getResumes()])
      .then(([profileData, resumesData]) => {
        if (cancelled) return
        setProfile(profileData)
        const resumes = resumesData?.results ?? resumesData ?? []
        setResume(resumes[0] ?? null)
        setStatus('success')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') return <LoadingSpinner label="Loading profile..." />
  if (status === 'error') {
    return (
      <Card className="p-8 text-center">
        <p className="text-critical font-medium">Could not load your profile.</p>
        <p className="mt-1 text-sm text-ink-muted">Make sure you're logged in and the server is running.</p>
      </Card>
    )
  }

  const extractionStatus = resume?.extraction_status ?? 'pending'

  if (!resume && !profile?.skills?.length) {
    return (
      <div className="space-y-5">
        <div className="mb-5">
          <p className="eyebrow mb-1.5">MY PROFILE</p>
          <h1 className="text-xl font-semibold text-ink">Competency Profile</h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-base font-medium text-ink">No resume uploaded yet</p>
          <p className="mt-1 mb-5 text-sm text-ink-muted">
            Upload your resume to extract your skills and build your TechLens profile.
          </p>
          <Link
            to="/resume-upload"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Upload Resume
          </Link>
        </Card>
      </div>
    )
  }

  const skills = profile?.skills?.length ? profile.skills : (resume?.extracted_skills ?? [])
  const techStack = profile?.tech_stack?.length ? profile.tech_stack : (resume?.extracted_tech_stack ?? [])
  const experience = profile?.experience?.length ? profile.experience : (resume?.extracted_experience ?? [])
  const education = profile?.education?.length ? profile.education : (resume?.extracted_education ?? [])

  return (
    <div className="space-y-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1.5">MY PROFILE</p>
          <h1 className="text-xl font-semibold text-ink">Competency Profile</h1>
        </div>
        <SkillBadge tone={STATUS_TONE[extractionStatus] ?? 'neutral'}>
          {extractionStatus === 'completed' ? 'Extracted' : extractionStatus}
        </SkillBadge>
      </div>

      <Card className="p-5">
        <CardHeader title={resume?.file_name ?? 'Resume'} eyebrow="PRIMARY RESUME" />
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="text-ink-muted">
            Uploaded{' '}
            {resume?.uploaded_at
              ? new Date(resume.uploaded_at).toLocaleDateString()
              : '—'}
          </span>
          {resume?.file && (
            <a
              href={resume.file}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              View file
            </a>
          )}
          {resume?.extraction_error && (
            <span className="text-critical">{resume.extraction_error}</span>
          )}
        </div>
      </Card>

      <Section title={`Skills Extracted (${skills.length})`} empty="No skills extracted yet.">
        <ChipList items={skills} />
      </Section>

      <Section title={`Tech Stack (${techStack.length})`} empty="No tech stack extracted yet.">
        <ChipList items={techStack} />
      </Section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Experience" empty="No experience extracted.">
          <ListItems items={experience} />
        </Section>
        <Section title="Education" empty="No education extracted.">
          <ListItems items={education} />
        </Section>
      </div>

      {resume?.extracted_text && (
        <Card className="p-5">
          <button
            type="button"
            onClick={() => setShowText((value) => !value)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-base font-semibold text-ink">Extracted Resume Text</span>
            <span className="text-sm text-primary">{showText ? 'Hide' : 'Show'}</span>
          </button>
          {showText && (
            <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-canvas p-4 font-mono text-xs leading-relaxed text-ink-muted">
              {resume.extracted_text}
            </pre>
          )}
        </Card>
      )}
    </div>
  )
}