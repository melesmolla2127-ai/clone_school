import { useState } from 'react'
import { BellRing, CalendarDays, Clock3, Info, Target } from 'lucide-react'
import useSettings from '../../hooks/useSettings'
import Button from '../common/Button'
import './ReminderCard.css'

function formatTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? ''))
  if (!match) return 'Time not set'

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return String(value)

  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function formatDays(days) {
  const list = Array.isArray(days) ? days : []
  if (!list.length) return 'No days selected'
  if (list.length === 7) return 'Every day'
  return list.join(', ')
}

function ReminderCard() {
  const { settings, saveSettings } = useSettings()
  const reminders = settings.reminders ?? {}
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState(() => (supported ? window.Notification.permission : 'unsupported'))
  const [message, setMessage] = useState('')

  const markRequested = () => saveSettings({ reminders: { ...reminders, permissionRequested: true } })

  const handleEnable = async () => {
    if (!supported) {
      markRequested()
      setMessage('This browser does not support browser notifications. In-app reminders still work.')
      return
    }

    if (permission === 'granted') {
      markRequested()
      setMessage('Browser permission is already granted. Reminders stay inside this app.')
      return
    }

    try {
      const result = await window.Notification.requestPermission()
      setPermission(result)
      setMessage(
        result === 'granted'
          ? 'Browser permission granted. This demo still reminds you only inside the app.'
          : 'Permission was not granted. In-app reminders still work.',
      )
    } catch {
      setMessage('Browser permission is unavailable. In-app reminders still work.')
    } finally {
      markRequested()
    }
  }

  const isEnabled = Boolean(reminders.enabled)
  const statusText = isEnabled
    ? permission === 'granted'
      ? 'Active · browser permission granted'
      : 'Active · in-app only'
    : 'Paused'

  return (
    <section className="reminder-card" aria-labelledby="reminder-card-title">
      <div className="reminder-card__top">
        <span className="reminder-card__icon" aria-hidden="true">
          <BellRing size={22} strokeWidth={2} />
        </span>
        <div className="reminder-card__heading">
          <h2 className="reminder-card__title" id="reminder-card-title">Study reminder</h2>
          <span className={`reminder-card__status ${isEnabled ? 'reminder-card__status--active' : 'reminder-card__status--paused'}`}>
            {statusText}
          </span>
        </div>
      </div>

      <p className="reminder-card__message">“{reminders.message || 'Keep learning with a short session today.'}”</p>

      <div className="reminder-card__details">
        <span className="reminder-card__detail">
          <Clock3 size={14} aria-hidden="true" />
          {formatTime(reminders.time)}
        </span>
        <span className="reminder-card__detail">
          <CalendarDays size={14} aria-hidden="true" />
          {formatDays(reminders.days)}
        </span>
        <span className="reminder-card__detail">
          <Target size={14} aria-hidden="true" />
          Goal: {reminders.goal || settings.learning?.dailyGoal || 5} actions
        </span>
      </div>

      <div className="reminder-card__notice">
        <Info size={15} aria-hidden="true" />
        <p>
          Frontend-only: reminders are saved in this browser and cannot send alerts when the tab is
          closed. Your app and saved progress work the same without browser permission.
        </p>
      </div>

      <Button
        className="reminder-card__button"
        type="button"
        variant="secondary"
        icon={BellRing}
        onClick={handleEnable}
      >
        Enable browser reminders
      </Button>

      {message && (
        <p className="reminder-card__permission" role="status">
          {message}
        </p>
      )}
    </section>
  )
}

export default ReminderCard
