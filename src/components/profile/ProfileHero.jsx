import { BookOpen, GraduationCap, LogOut, PencilLine, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import Button from '../common/Button'
import './ProfileHero.css'

function ProfileHero({ name, initial, gradeLabel, stream, school, status, onEdit, onSettings, onLogout }) {
  return (
    <section className="profile-hero" aria-labelledby="profile-hero-name">
      <div className="profile-hero__top">
        <span className="profile-hero__avatar" aria-hidden="true">
          {initial}
        </span>
        <div className="profile-hero__identity">
          <span className="profile-hero__kicker">Student profile</span>
          <h1 id="profile-hero-name">{name}</h1>
          <div className="profile-hero__meta">
            <span>
              <GraduationCap size={15} aria-hidden="true" />
              {gradeLabel}
            </span>
            {stream && (
              <span>
                <BookOpen size={15} aria-hidden="true" />
                {stream}
              </span>
            )}
            <span>
              <Sparkles size={15} aria-hidden="true" />
              {school}
            </span>
          </div>
          <span className="profile-hero__status">
            <span className="profile-hero__status-dot" aria-hidden="true" />
            {status}
          </span>
        </div>
      </div>

      <div className="profile-hero__actions">
        <Button type="button" icon={PencilLine} onClick={onEdit}>
          Edit profile
        </Button>
        <Button type="button" variant="secondary" icon={SettingsIcon} onClick={onSettings}>
          Settings
        </Button>
        <Button type="button" variant="secondary" icon={LogOut} onClick={onLogout}>
          Log out
        </Button>
      </div>
    </section>
  )
}

export default ProfileHero
