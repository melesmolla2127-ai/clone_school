import { learningStats } from '../../data/homeData'
import HomeSectionHeading from './HomeSectionHeading'
import './LearningOverview.css'

function StatVisual({ stat }) {
  if (stat.percent) {
    return (
      <span
        className="learning-stat__ring"
        style={{ '--progress': `${stat.percent}%` }}
        aria-hidden="true"
      >
        <span>{stat.percent}%</span>
      </span>
    )
  }

  const Icon = stat.icon
  return (
    <span className="learning-stat__icon" aria-hidden="true">
      <Icon size={21} strokeWidth={2} />
    </span>
  )
}

function LearningOverview() {
  return (
    <section className="learning-overview" aria-labelledby="learning-overview-title">
      <HomeSectionHeading
        kicker="Daily overview"
        title="Today’s learning"
        id="learning-overview-title"
        action={<span className="learning-overview__demo-tag">Demo data</span>}
      />

      <div className="learning-overview__grid">
        {learningStats.map((stat) => (
          <article className={`learning-stat learning-stat--${stat.tone}`} key={stat.id}>
            <StatVisual stat={stat} />
            <div className="learning-stat__copy">
              <span className="learning-stat__label">{stat.label}</span>
              <strong className="learning-stat__value">{stat.value}</strong>
              <span className="learning-stat__caption">{stat.caption}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LearningOverview
