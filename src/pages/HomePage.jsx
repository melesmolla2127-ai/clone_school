import AIAssistantCard from '../components/home/AIAssistantCard'
import Announcements from '../components/home/Announcements'
import DailyStudyPlan from '../components/notifications/DailyStudyPlan'
import ContinueLearningCard from '../components/home/ContinueLearningCard'
import DailyChallenge from '../components/home/DailyChallenge'
import HomeIntro from '../components/home/HomeIntro'
import LearningOverview from '../components/home/LearningOverview'
import QuickAccess from '../components/home/QuickAccess'
import ReminderCard from '../components/notifications/ReminderCard'
import UpcomingEvents from '../components/home/UpcomingEvents'
import WelcomeHeader from '../components/home/WelcomeHeader'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <WelcomeHeader />
      <LearningOverview />
      <QuickAccess />
      <ContinueLearningCard />

      <div className="home-page__grid home-page__grid--assist">
        <DailyStudyPlan />
        <ReminderCard />
      </div>

      <div className="home-page__grid home-page__grid--insights">
        <Announcements />
        <UpcomingEvents />
      </div>

      <div className="home-page__grid home-page__grid--assist">
        <DailyChallenge />
        <AIAssistantCard />
      </div>

      <HomeIntro />
    </div>
  )
}

export default HomePage
