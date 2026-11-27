import { CalendarDays } from 'lucide-react'
import EmptyState from '../courses/EmptyState'
import ProgressBar from '../courses/ProgressBar'
import './DailyActivityList.css'

function getDayLabel(value) {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' })
}

function DailyActivityList({ days = [], goal = 5 }) {
  const entries = Array.isArray(days) ? days : []
  const today = entries[entries.length - 1]
  const maxActions = Math.max(1, ...entries.map((entry) => Number(entry.actions) || 0))
  const hasActivity = entries.some((entry) => (Number(entry.actions) || 0) > 0)

  if (!hasActivity) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No daily activity yet"
        message="Complete lessons, games, or practice questions to build your 7-day activity streak."
      />
    )
  }

  return (
    <div className="daily-activity">
      <div className="daily-activity__summary">
        <span>Today</span>
        <strong>
          {Number(today?.actions) || 0} of {goal} actions
        </strong>
      </div>
      <ProgressBar
        value={goal ? Math.round(((Number(today?.actions) || 0) / goal) * 100) : 0}
        label="Daily study goal"
      />
      <div className="daily-activity__chart" aria-label="Actions completed over the last 7 days">
        {entries.map((entry) => {
          const actions = Number(entry.actions) || 0
          const height = actions ? Math.max(8, Math.round((actions / maxActions) * 100)) : 3

          return (
            <div className="daily-activity__day" key={entry.date}>
              <div className="daily-activity__bar-track">
                <span
                  className={entry.goalCompleted ? 'daily-activity__bar daily-activity__bar--complete' : 'daily-activity__bar'}
                  style={{ height: `${height}%` }}
                  title={`${actions} actions`}
                />
              </div>
              <strong>{actions}</strong>
              <span>{getDayLabel(entry.date)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailyActivityList
