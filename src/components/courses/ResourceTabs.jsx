import { useState } from 'react'
import { ArrowRight, ClipboardList, FileText, Play, PlayCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import './ResourceTabs.css'

const TABS = [
  { id: 'videos', label: 'Videos', icon: PlayCircle },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'questions', label: 'Questions', icon: ClipboardList },
]

function ResourceTabs({ resources, questions = [], practicePath }) {
  const navigate = useNavigate()
  const videos = resources?.videos || []
  const notes = resources?.notes || []
  const resourceKey = videos[0]?.id || notes[0]?.id || 'empty'
  const [activeTab, setActiveTab] = useState('videos')
  const [previewState, setPreviewState] = useState({ key: null, value: null })
  const preview = previewState.key === resourceKey ? previewState.value : null
  const setPreview = (value) => setPreviewState({ key: resourceKey, value })
  const questionCount = resources?.questionCount || 0
  const counts = { videos: videos.length, notes: notes.length, questions: questionCount }

  return (
    <section className="resource-tabs" aria-label="Learning resources">
      <div className="resource-tabs__header" role="tablist" aria-label="Resource type">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`resource-tabs__tab ${activeTab === tab.id ? 'resource-tabs__tab--active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{tab.label}</span>
              <small>{counts[tab.id]}</small>
            </button>
          )
        })}
      </div>

      {preview && (
        <div className="resource-preview" role="status">
          <button className="resource-preview__close" type="button" onClick={() => setPreview(null)} aria-label="Close preview">
            <X size={16} aria-hidden="true" />
          </button>
          <span className="resource-preview__badge">{preview.type === 'video' ? 'Video preview' : 'Note preview'}</span>
          <h3>{preview.title}</h3>
          <p>Learning resources will be available soon. This demo shows the resource details only.</p>
          {preview.body && <p className="resource-preview__body">{preview.body}</p>}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="resource-grid">
          {videos.length === 0 ? (
            <p className="resource-tabs__empty">Videos will be available soon.</p>
          ) : (
            videos.map((video) => (
              <button
                className="resource-card resource-card--video"
                key={video.id}
                type="button"
                onClick={() => setPreview({ type: 'video', title: video.title })}
              >
                <span className="resource-card__thumb" aria-hidden="true">
                  <Play size={18} fill="currentColor" />
                </span>
                <span className="resource-card__body">
                  <strong>{video.title}</strong>
                  <small>{video.unit} · {video.duration}</small>
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="resource-grid">
          {notes.length === 0 ? (
            <p className="resource-tabs__empty">Learning resources will be available soon.</p>
          ) : (
            notes.map((note) => (
              <button
                className="resource-card resource-card--note"
                key={note.id}
                type="button"
                onClick={() => setPreview({ type: 'note', title: note.title, body: note.preview })}
              >
                <span className="resource-card__thumb" aria-hidden="true">
                  <FileText size={18} />
                </span>
                <span className="resource-card__body">
                  <strong>{note.title}</strong>
                  <small>{note.unit} · {note.type}</small>
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="question-resources">
          <div className="question-resources__summary">
            <span className="question-resources__icon" aria-hidden="true">
              <ClipboardList size={22} />
            </span>
            <div>
              <h3>{questionCount} practice questions</h3>
              <p>
                Try {questions.length} demo questions now. The full question library is being prepared for this unit.
              </p>
            </div>
          </div>

          <ul className="question-resources__list">
            {questions.map((question) => (
              <li key={question.id}>
                <span>{question.type}</span>
                <p>{question.prompt}</p>
              </li>
            ))}
          </ul>

          {practicePath && (
            <Button type="button" icon={ArrowRight} onClick={() => navigate(practicePath)}>
              Start practice
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

export default ResourceTabs
