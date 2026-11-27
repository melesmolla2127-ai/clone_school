import { upcomingEvents } from '../../data/events'
import HomeSectionHeading from './HomeSectionHeading'
import './UpcomingEvents.css'

function UpcomingEvents() {
  return (
    <section className="upcoming-events" aria-labelledby="upcoming-events-title">
      <HomeSectionHeading
        kicker="On your calendar"
        title="Upcoming events"
        id="upcoming-events-title"
      />

      <div className="upcoming-events__list">
        {upcomingEvents.map((event) => {
          const Icon = event.icon
          return (
            <article className="event-row" key={event.id}>
              <span className="event-row__date">
                <strong>{event.date.split(',')[0]}</strong>
                <small>{event.date.split(',')[1]?.trim()}</small>
              </span>
              <span className="event-row__icon" aria-hidden="true">
                <Icon size={17} strokeWidth={2} />
              </span>
              <div className="event-row__body">
                <div className="event-row__meta">
                  <strong>{event.title}</strong>
                  <span>{event.category}</span>
                </div>
                <p>{event.description}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default UpcomingEvents
