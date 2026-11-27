import { useState } from 'react'
import {
  Bell,
  BookOpen,
  CheckCircle2,
  Languages,
  LogOut,
  Palette,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/courses/PageHeader'
import Button from '../components/common/Button'
import CheckboxField from '../components/auth/CheckboxField'
import SelectField from '../components/common/SelectField'
import TextField from '../components/common/TextField'
import BrowserReminderCard from '../components/settings/BrowserReminderCard'
import ChoiceGroup from '../components/settings/ChoiceGroup'
import ConfirmDialog from '../components/settings/ConfirmDialog'
import PasswordChangeForm from '../components/settings/PasswordChangeForm'
import SettingsSection from '../components/settings/SettingsSection'
import ToggleRow from '../components/settings/ToggleRow'
import { GRADE_OPTIONS } from '../data/options.js'
import useAuth from '../hooks/useAuth'
import useNotifications from '../hooks/useNotifications'
import useSettings from '../hooks/useSettings'
import { getFullName } from '../services/profileService.js'
import './SettingsPage.css'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'am', label: 'Amharic' },
  { value: 'om', label: 'Afaan Oromoo' },
]

const CONTENT_PREFERENCE_OPTIONS = [
  { value: 'mixed', label: 'Mixed lessons' },
  { value: 'text', label: 'Text focused' },
  { value: 'visual', label: 'Visual focused' },
  { value: 'audio', label: 'Audio focused' },
]

const STUDY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const NOTIFICATION_OPTIONS = [
  {
    key: 'studyReminders',
    label: 'Study reminders',
    description: 'Nudge yourself to keep a steady study habit.',
  },
  {
    key: 'dailyChallenges',
    label: 'Daily challenges',
    description: 'Highlight new daily challenges and goals.',
  },
  {
    key: 'courseUpdates',
    label: 'Course updates',
    description: 'Show updates for lessons and subjects.',
  },
  {
    key: 'gameAchievements',
    label: 'Game achievements',
    description: 'Celebrate game scores and unlocked badges.',
  },
  {
    key: 'examReminders',
    label: 'Exam reminders',
    description: 'Keep upcoming EUEE practice in view.',
  },
  {
    key: 'announcements',
    label: 'Announcements',
    description: 'Announce news from the demo learning platform.',
  },
]

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return date.toLocaleDateString()
}

function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return date.toLocaleString()
}

function SettingsPage() {
  const { student, session, signOut, changePassword, deleteAccount } = useAuth()
  const { settings, saveSettings, t } = useSettings()
  const { notify } = useNotifications()
  const navigate = useNavigate()

  const [feedback, setFeedback] = useState('')
  const [feedbackTone, setFeedbackTone] = useState('success')
  const [permission, setPermission] = useState(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const setNotice = (message, tone = 'success') => {
    setFeedback(message)
    setFeedbackTone(tone)
  }

  const updateSetting = (patch, message = t('common.saved')) => {
    saveSettings(patch)
    setNotice(message)
    notify({
      category: 'system',
      title: 'Settings updated',
      message,
      actionPath: '/settings',
      iconName: 'Settings',
      eventKey: 'settings-updated',
    })
  }

  const handleLogout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  const handlePermission = async () => {
    if (typeof Notification === 'undefined') {
      setNotice('Browser notifications are not supported.', 'error')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      updateSetting(
        { reminders: { permissionRequested: true } },
        result === 'granted' ? 'Browser notifications enabled.' : 'Browser notifications were not enabled.',
      )
    } catch {
      setNotice('Browser notifications could not be enabled.', 'error')
    }
  }

  const handleStudyDay = (day) => {
    const current = settings.learning?.studyDays ?? []
    const next = current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    updateSetting(
      { learning: { studyDays: next }, reminders: { days: next } },
      'Study days updated.',
    )
  }

  const handleDailyGoal = (event) => {
    const dailyGoal = Math.max(1, Math.min(99, Number(event.target.value) || 1))
    updateSetting(
      { learning: { dailyGoal }, reminders: { goal: dailyGoal } },
      'Daily study goal updated.',
    )
  }

  const handleReminderTime = (event) => {
    const time = event.target.value
    updateSetting(
      { learning: { reminderTime: time }, reminders: { time } },
      'Reminder time updated.',
    )
  }

  const handleDelete = () => {
    setDeleting(true)
    const result = deleteAccount()
    setDeleting(false)

    if (!result.ok) {
      setDeleteOpen(false)
      setNotice(result.error, 'error')
      return
    }

    setDeleteOpen(false)
    navigate('/login', { replace: true })
  }

  const gradeLabel = GRADE_OPTIONS.find((grade) => grade.value === student?.grade)?.label ?? 'Not set'
  const feedbackClass = feedbackTone === 'error' ? 'settings-page__feedback settings-page__feedback--error' : 'settings-page__feedback'

  return (
    <div className="settings-page">
      <PageHeader
        kicker="Preferences"
        title={t('settings.title')}
        description={t('settings.subtitle')}
        backTo="/profile"
      />

      {feedback && (
        <div className={feedbackClass} role={feedbackTone === 'error' ? 'alert' : 'status'}>
          {feedbackTone === 'error' ? <Bell size={17} aria-hidden="true" /> : <CheckCircle2 size={17} aria-hidden="true" />}
          {feedback}
        </div>
      )}

      <div className="settings-page__grid">
        <div className="settings-page__column">
          <SettingsSection
            icon={Palette}
            title={t('settings.appearance')}
            description="Choose how Clone School looks on this device."
          >
            <ChoiceGroup
              label={t('settings.theme')}
              value={settings.theme}
              options={THEME_OPTIONS}
              onChange={(theme) => updateSetting({ theme }, 'Appearance updated.')}
            />
          </SettingsSection>

          <SettingsSection
            icon={Languages}
            title={t('settings.language')}
            description="Choose your preferred display language."
          >
            <SelectField
              id="settings-language"
              label="Display language"
              options={LANGUAGE_OPTIONS}
              value={settings.language}
              onChange={(event) => updateSetting({ language: event.target.value }, 'Language updated.')}
            />
          </SettingsSection>

          <SettingsSection
            icon={Bell}
            title={t('settings.notifications')}
            description="Control which updates appear in your notification center."
          >
            <div className="settings-page__toggle-list">
              {NOTIFICATION_OPTIONS.map((option) => (
                <ToggleRow
                  key={option.key}
                  id={`notification-${option.key}`}
                  label={option.label}
                  description={option.description}
                  checked={Boolean(settings.notifications?.[option.key])}
                  onChange={(checked) =>
                    updateSetting(
                      { notifications: { [option.key]: checked } },
                      'Notification preferences updated.',
                    )
                  }
                />
              ))}
            </div>
            <BrowserReminderCard
              enabled={Boolean(settings.reminders?.enabled)}
              permission={permission}
              onToggle={(enabled) => updateSetting({ reminders: { enabled } }, 'Reminder settings updated.')}
              onRequestPermission={handlePermission}
            />
          </SettingsSection>
        </div>

        <div className="settings-page__column">
          <SettingsSection
            icon={BookOpen}
            title={t('settings.learning')}
            description="Set daily targets and shape your study experience."
          >
            <div className="settings-page__learning-grid">
              <TextField
                id="settings-daily-goal"
                label="Daily study goal"
                type="number"
                min="1"
                max="99"
                value={settings.learning?.dailyGoal ?? 5}
                onChange={handleDailyGoal}
              />
              <TextField
                id="settings-reminder-time"
                label="Reminder time"
                type="time"
                value={settings.learning?.reminderTime ?? '18:00'}
                onChange={handleReminderTime}
              />
            </div>

            <fieldset className="settings-page__days">
              <legend>Study days</legend>
              <div className="settings-page__days-grid">
                {STUDY_DAYS.map((day) => (
                  <CheckboxField
                    key={day}
                    id={`study-day-${day}`}
                    label={day}
                    checked={(settings.learning?.studyDays ?? []).includes(day)}
                    onChange={() => handleStudyDay(day)}
                  />
                ))}
              </div>
            </fieldset>

            <SelectField
              id="settings-content-preference"
              label="Content preference"
              options={CONTENT_PREFERENCE_OPTIONS}
              value={settings.learning?.contentPreference ?? 'mixed'}
              onChange={(event) =>
                updateSetting(
                  { learning: { contentPreference: event.target.value } },
                  'Content preference updated.',
                )
              }
            />

            <div className="settings-page__toggle-list">
              <ToggleRow
                id="settings-sound-effects"
                label="Sound effects"
                description="Play sounds for game and lesson feedback."
                checked={Boolean(settings.learning?.soundEffects)}
                onChange={(soundEffects) =>
                  updateSetting({ learning: { soundEffects } }, 'Sound effects updated.')
                }
              />
              <ToggleRow
                id="settings-reduced-motion"
                label="Reduced motion"
                description="Limit animations across the learning app."
                checked={Boolean(settings.learning?.reducedMotion)}
                onChange={(reducedMotion) =>
                  updateSetting({ learning: { reducedMotion } }, 'Reduced motion updated.')
                }
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={ShieldCheck}
            title={t('settings.privacy')}
            description="Review your demo account and manage access."
          >
            <div className="settings-page__account">
              <h3>Account info</h3>
              <div className="settings-page__info-list">
                <div className="settings-page__info-row">
                  <span>Student</span>
                  <strong>{student ? getFullName(student) : 'Student'}</strong>
                </div>
                <div className="settings-page__info-row">
                  <span>Phone number</span>
                  <strong>{student?.phoneNumber || 'Not available'}</strong>
                </div>
                <div className="settings-page__info-row">
                  <span>Grade</span>
                  <strong>{gradeLabel}</strong>
                </div>
                <div className="settings-page__info-row">
                  <span>Member since</span>
                  <strong>{formatDate(student?.createdAt)}</strong>
                </div>
              </div>
              <p className="settings-page__note">This demo account and its progress are stored only in this browser.</p>
            </div>

            <div className="settings-page__account">
              <h3>Change password</h3>
              <PasswordChangeForm onChangePassword={changePassword} />
            </div>

            <div className="settings-page__account">
              <h3>Session info</h3>
              <div className="settings-page__info-list">
                <div className="settings-page__info-row">
                  <span>Status</span>
                  <strong>Session active</strong>
                </div>
                <div className="settings-page__info-row">
                  <span>Signed in</span>
                  <strong>{formatDateTime(session?.issuedAt)}</strong>
                </div>
                <div className="settings-page__info-row">
                  <span>Remember me</span>
                  <strong>{session?.remember ? 'Enabled' : 'Disabled'}</strong>
                </div>
              </div>
            </div>

            <div className="settings-page__security-actions">
              <Button type="button" variant="secondary" icon={LogOut} onClick={handleLogout}>
                Log out
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={Trash2}
                className="settings-page__danger"
                onClick={() => setDeleteOpen(true)}
              >
                Delete demo account
              </Button>
            </div>
          </SettingsSection>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete demo account?"
        message="This removes the demo account and its stored progress from this browser. This cannot be undone."
        confirmLabel="Confirm delete"
        cancelLabel="Cancel"
        busy={deleting}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default SettingsPage
