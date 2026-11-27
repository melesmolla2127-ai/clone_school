import { announcements } from '../../data/announcements'
import HomeSectionHeading from './HomeSectionHeading'
import './Announcements.css'

function Announcements() {
  return (
    <section className="announcements" aria-labelledby="announcements-title">
      <HomeSectionHeading
        kicker="Stay in the loop"
        title="Announcements"
        id="announcements-title"
      />

      <div className="announcements__list">
        {announcements.map((item) => {
          const Icon = item.icon
          return (
            <article
              className={`announcement announcement--${item.tone} ${
                item.featured ? 'announcement--featured' : ''
              }`}
              key={item.id}
            >
              <span className="announcement__icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2} />
              </span>
              <div className="announcement__body">
                <div className="announcement__meta">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Announcements
