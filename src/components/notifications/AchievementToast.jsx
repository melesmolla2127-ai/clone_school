import { useEffect, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Crosshair,
  Flame,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react'
import './AchievementToast.css'

const ICONS = {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Crosshair,
  Flame,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
}

const TONES = ['blue', 'sky', 'navy', 'indigo', 'teal', 'green']

function AchievementToast() {
  const [achievement, setAchievement] = useState(null)

  useEffect(() => {
    let timeoutId

    const handleAchievement = (event) => {
      const detail = event.detail ?? {}
      if (!detail.title) return

      setAchievement({
        title: String(detail.title),
        description: String(detail.description ?? ''),
        xp: Math.max(0, Number(detail.xp) || 0),
        iconName: String(detail.iconName ?? 'Trophy'),
        tone: TONES.includes(detail.tone) ? detail.tone : 'blue',
      })

      if (timeoutId) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setAchievement(null), 4500)
    }

    window.addEventListener('clone-school:achievement', handleAchievement)
    return () => {
      window.removeEventListener('clone-school:achievement', handleAchievement)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  if (!achievement) return null

  const Icon = ICONS[achievement.iconName] || Trophy

  return (
    <div
      className={`achievement-toast achievement-toast--${achievement.tone}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="achievement-toast__glow" aria-hidden="true" />
      <span className="achievement-toast__spark achievement-toast__spark--one" aria-hidden="true" />
      <span className="achievement-toast__spark achievement-toast__spark--two" aria-hidden="true" />
      <span className="achievement-toast__spark achievement-toast__spark--three" aria-hidden="true" />

      <span className="achievement-toast__icon" aria-hidden="true">
        <Icon size={26} strokeWidth={2} />
      </span>

      <div className="achievement-toast__copy">
        <span className="achievement-toast__eyebrow">
          <Sparkles size={12} aria-hidden="true" />
          Achievement unlocked
        </span>
        <strong className="achievement-toast__title">{achievement.title}</strong>
        {achievement.description && (
          <span className="achievement-toast__description">{achievement.description}</span>
        )}
        {achievement.xp > 0 && <span className="achievement-toast__xp">+{achievement.xp} XP</span>}
      </div>

      <button
        className="achievement-toast__dismiss"
        type="button"
        aria-label="Dismiss achievement"
        onClick={() => setAchievement(null)}
      >
        <X size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  )
}

export default AchievementToast
