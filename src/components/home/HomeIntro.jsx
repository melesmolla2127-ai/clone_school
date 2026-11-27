import { CheckCircle2, GraduationCap } from 'lucide-react'
import { introHighlights } from '../../data/homeData'
import './HomeIntro.css'

function HomeIntro() {
  return (
    <section className="home-intro" aria-labelledby="home-intro-title">
      <div className="home-intro__icon" aria-hidden="true">
        <GraduationCap size={21} strokeWidth={1.9} />
      </div>

      <div className="home-intro__copy">
        <h2 id="home-intro-title">Learning that fits your life</h2>
        <p>
          Clone School brings lessons, practice, and exam preparation into one calm space so you
          can build knowledge at your own pace.
        </p>
        <div className="home-intro__highlights">
          {introHighlights.map((item) => (
            <span key={item}>
              <CheckCircle2 size={14} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeIntro
