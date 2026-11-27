import './HomeSectionHeading.css'

function HomeSectionHeading({ kicker, title, id, action }) {
  return (
    <div className="home-section-heading">
      <div>
        <span className="home-section-heading__kicker">{kicker}</span>
        <h2 className="home-section-heading__title" id={id}>
          {title}
        </h2>
      </div>
      {action && <div className="home-section-heading__action">{action}</div>}
    </div>
  )
}

export default HomeSectionHeading
