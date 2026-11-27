import './ProfileStatCard.css'

function ProfileStatCard({ icon: Icon, label, value, detail, children }) {
  return (
    <article className="profile-stat-card">
      <div className="profile-stat-card__head">
        <span className="profile-stat-card__icon" aria-hidden="true">
          {Icon && <Icon size={18} strokeWidth={2} />}
        </span>
        <span className="profile-stat-card__label">{label}</span>
      </div>
      <strong className="profile-stat-card__value">{value}</strong>
      {detail && <p className="profile-stat-card__detail">{detail}</p>}
      {children}
    </article>
  )
}

export default ProfileStatCard
