import { getEueeSubject } from '../../data/euee/eueeSubjects.js'
import './PerformancePanel.css'

function PerformancePanel({ session }) {
  const bySubject = session.answers.reduce((acc, item) => {
    const key = item.subjectId
    const current = acc[key] || { subjectId: key, total: 0, correct: 0 }
    current.total += 1
    if (item.correct) current.correct += 1
    acc[key] = current
    return acc
  }, {})

  const subjects = Object.values(bySubject).map((item) => ({
    ...item,
    name: getEueeSubject(item.subjectId)?.name || item.subjectId,
    percent: item.total ? Math.round((item.correct / item.total) * 100) : 0,
  }))

  const topicStats = session.answers.reduce((acc, item) => {
    const key = `${item.subjectId}::${item.topic}`
    const current = acc[key] || { subjectId: item.subjectId, topic: item.topic, total: 0, correct: 0 }
    current.total += 1
    if (item.correct) current.correct += 1
    acc[key] = current
    return acc
  }, {})

  const topics = Object.values(topicStats).map((item) => ({
    ...item,
    percent: item.total ? Math.round((item.correct / item.total) * 100) : 0,
  }))
  const strongTopics = topics.filter((item) => item.percent >= 70).sort((a, b) => b.percent - a.percent).slice(0, 4)
  const weakTopics = topics.filter((item) => item.percent < 70).sort((a, b) => a.percent - b.percent).slice(0, 4)
  const weakSubjects = subjects.filter((item) => item.percent < 70).sort((a, b) => a.percent - b.percent)

  return (
    <div className="euee-performance">
      <section className="euee-performance__card">
        <h3>Subject breakdown</h3>
        <div className="euee-performance__bars">
          {subjects.map((item) => (
            <div key={item.subjectId} className="euee-performance__bar">
              <div className="euee-performance__bar-label">
                <span>{item.name}</span>
                <strong>{item.correct}/{item.total} · {item.percent}%</strong>
              </div>
              <div className="euee-performance__track"><span style={{ width: `${item.percent}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
      <section className="euee-performance__card">
        <h3>Strong topics</h3>
        {strongTopics.length ? (
          <ul className="euee-performance__list">
            {strongTopics.map((item) => (
              <li key={`${item.subjectId}-${item.topic}`}><span>{item.topic}</span><strong>{item.percent}%</strong></li>
            ))}
          </ul>
        ) : <p className="euee-performance__empty">No strong topics identified yet.</p>}
      </section>
      <section className="euee-performance__card">
        <h3>Weak topics</h3>
        {weakTopics.length ? (
          <ul className="euee-performance__list euee-performance__list--weak">
            {weakTopics.map((item) => (
              <li key={`${item.subjectId}-${item.topic}`}><span>{item.topic}</span><strong>{item.percent}%</strong></li>
            ))}
          </ul>
        ) : <p className="euee-performance__empty">No weak topics identified.</p>}
      </section>
      <section className="euee-performance__card">
        <h3>Subjects needing improvement</h3>
        {weakSubjects.length ? (
          <ul className="euee-performance__list euee-performance__list--weak">
            {weakSubjects.map((item) => (
              <li key={item.subjectId}><span>{item.name}</span><strong>{item.percent}%</strong></li>
            ))}
          </ul>
        ) : <p className="euee-performance__empty">All subjects are in a strong range.</p>}
      </section>
    </div>
  )
}

export default PerformancePanel
