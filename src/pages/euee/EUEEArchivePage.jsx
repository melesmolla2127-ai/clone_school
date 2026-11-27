import { useMemo, useState } from 'react'
import { Archive, BookOpen, CalendarDays, ChevronRight, GraduationCap, Info, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import PageHeader from '../../components/courses/PageHeader'
import ProgressBar from '../../components/courses/ProgressBar'
import { ARCHIVE_VERIFICATION } from '../../data/euee/archive/archiveCatalog.js'
import { getArchiveCoverage, getArchiveYearSummary, getArchiveYears } from '../../data/euee/archive/eueeArchive.js'
import { getArchiveAttempt, getArchiveProgressSummary } from '../../services/eueeArchiveService.js'
import './EUEEArchivePage.css'

function verificationTone(status) {
  if (status === ARCHIVE_VERIFICATION.IMPORTED_UNVERIFIED) return 'warning'
  if (status === ARCHIVE_VERIFICATION.VERIFIED_OFFICIAL || status === ARCHIVE_VERIFICATION.VERIFIED_PUBLIC) return 'success'
  return 'muted'
}

function EUEEArchivePage() {
  const navigate = useNavigate()
  const years = useMemo(() => getArchiveYears(), [])
  const coverage = useMemo(() => getArchiveCoverage(), [])
  const progress = useMemo(() => getArchiveProgressSummary(), [])
  const [selectedYear, setSelectedYear] = useState(years[0])
  const [streamId, setStreamId] = useState('natural-science')
  const [query, setQuery] = useState('')

  const summary = useMemo(() => getArchiveYearSummary(selectedYear), [selectedYear])
  const activeStream = summary.streams.find((stream) => stream.id === streamId) ?? summary.streams[0]
  const subjects = activeStream.subjects.filter((subject) => subject.subjectName.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="archive-page">
      <PageHeader
        kicker="Historical archive"
        title="EUEE Historical Archive"
        description="Browse Ethiopian University Entrance Examination archives by Ethiopian calendar year, stream, and subject. Only imported question sets are marked available; unavailable years remain visible for future expansion."
        backTo="/euee"
      />

      <section className="archive-hero">
        <div>
          <span className="archive-hero__eyebrow">2000 E.C. - {coverage.endYear} E.C.</span>
          <h2>Practice previous entrance exams</h2>
          <p>Archive coverage is expandable. Authentic historical questions are shown only when a source is recorded; missing years are clearly marked unavailable instead of being fabricated.</p>
          <div className="archive-hero__meta">
            <span><CalendarDays size={15} aria-hidden="true" /> {coverage.yearCount} years</span>
            <span><BookOpen size={15} aria-hidden="true" /> {coverage.available} imported exam sets</span>
            <span><GraduationCap size={15} aria-hidden="true" /> {progress.attemptedExams} attempted</span>
          </div>
        </div>
        <div className="archive-hero__ring" style={{ '--progress': `${coverage.totalSlots ? Math.round((coverage.available / coverage.totalSlots) * 100) : 0}%` }}>
          <div className="archive-hero__ring-inner">
            <strong>{coverage.available}</strong>
            <span>Available sets</span>
          </div>
        </div>
      </section>

      <section className="archive-controls euee-panel" aria-labelledby="archive-controls-title">
        <div className="archive-controls__header">
          <div>
            <span className="euee-section__kicker">Browse archive</span>
            <h2 id="archive-controls-title">Select year and stream</h2>
          </div>
          <label className="archive-search">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search subjects</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subject" />
          </label>
        </div>
        <div className="archive-year-grid" role="listbox" aria-label="Ethiopian exam year">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className={`archive-year ${year === selectedYear ? 'archive-year--active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year} E.C.
            </button>
          ))}
        </div>
        <div className="archive-streams" role="tablist" aria-label="Academic stream">
          {summary.streams.map((stream) => (
            <button
              key={stream.id}
              type="button"
              role="tab"
              aria-selected={stream.id === activeStream.id}
              className={`archive-stream ${stream.id === activeStream.id ? 'archive-stream--active' : ''}`}
              onClick={() => setStreamId(stream.id)}
            >
              <strong>{stream.name}</strong>
              <span>{stream.availableCount}/{stream.totalCount} subjects available</span>
            </button>
          ))}
        </div>
      </section>

      <section className="euee-section" aria-labelledby="archive-subjects-title">
        <div className="euee-section__heading">
          <div>
            <span className="euee-section__kicker">{summary.yearLabel} ? {activeStream.name}</span>
            <h2 id="archive-subjects-title">Subject exams</h2>
          </div>
        </div>
        <div className="archive-subject-grid">
          {subjects.map((subject) => {
            const attempt = getArchiveAttempt(selectedYear, activeStream.id, subject.subjectId)
            const tone = verificationTone(subject.verificationStatus)
            return (
              <article key={subject.subjectId} className="archive-subject-card">
                <div className="archive-subject-card__top">
                  <div>
                    <span className="archive-subject-card__year">{summary.yearLabel}</span>
                    <h3>{subject.subjectName}</h3>
                  </div>
                  <span className={`archive-status archive-status--${tone}`}>{subject.verificationStatus}</span>
                </div>
                <p className="archive-subject-card__meta">
                  <span>{subject.available ? `${subject.questionCount} questions` : 'No imported questions'}</span>
                  <span>{attempt ? `Last score ${attempt.lastScore}%` : 'Not attempted'}</span>
                </p>
                {subject.available ? (
                  <>
                    <ProgressBar value={attempt?.bestScore ?? 0} label={attempt ? `Best ${attempt.bestScore}%` : 'Ready to practice'} />
                    <div className="archive-subject-card__actions">
                      <Button type="button" onClick={() => navigate(`/euee/archive/${selectedYear}/${activeStream.id}/${subject.subjectId}`)}>
                        {attempt ? 'Practice again' : 'Start exam'}
                        <ChevronRight size={16} aria-hidden="true" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="archive-subject-card__unavailable">
                    <Info size={16} aria-hidden="true" />
                    <p>Archive unavailable or incomplete for this year/subject. The slot is kept visible and can be populated when verified data is available.</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="euee-panel archive-integrity">
        <div className="archive-integrity__icon" aria-hidden="true"><Archive size={22} /></div>
        <div>
          <h3>Data integrity</h3>
          <p>Imported historical questions include year, stream, subject, source, and verification status metadata. Demo or unverified public imports are never labeled as official historical exams.</p>
        </div>
      </section>
    </div>
  )
}

export default EUEEArchivePage
