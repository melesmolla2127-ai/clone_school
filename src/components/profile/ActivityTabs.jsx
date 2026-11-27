import { useState } from 'react'
import { Activity, BookOpen, CalendarDays, Gamepad2, GraduationCap, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ActivityList from './ActivityList'
import DailyActivityList from './DailyActivityList'
import './ActivityTabs.css'

const TABS = [
  {
    id: 'all',
    label: 'All activity',
    icon: Activity,
    description: 'Your latest learning moments across Clone School.',
    emptyTitle: 'No activity yet',
    emptyMessage: 'Open a lesson, play a game, or try a practice exam to start your activity feed.',
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: BookOpen,
    description: 'The most recent lessons you opened.',
    emptyTitle: 'No recent courses',
    emptyMessage: 'Start a course and your latest lesson will appear here.',
    emptyAction: 'Browse courses',
    path: '/courses',
  },
  {
    id: 'games',
    label: 'Games',
    icon: Gamepad2,
    description: 'Learning games you played recently.',
    emptyTitle: 'No games played yet',
    emptyMessage: 'Play a quick learning game to earn XP and see it here.',
    emptyAction: 'Play a game',
    path: '/games',
  },
  {
    id: 'euee',
    label: 'Practice & exams',
    icon: GraduationCap,
    description: 'Your latest EUEE practice and mock exams.',
    emptyTitle: 'No practice yet',
    emptyMessage: 'Take an EUEE practice exam to track your accuracy over time.',
    emptyAction: 'Practice for EUEE',
    path: '/euee',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: Trophy,
    description: 'Badges and milestones you have unlocked.',
    emptyTitle: 'No achievements yet',
    emptyMessage: 'Keep learning to unlock your first achievement.',
  },
  {
    id: 'daily',
    label: 'Daily activity',
    icon: CalendarDays,
    description: 'Actions completed over the last seven days.',
  },
]

function ActivityTabs({ activity = {}, dailyGoal = 5 }) {
  const [selectedId, setSelectedId] = useState('all')
  const navigate = useNavigate()
  const selectedTab = TABS.find((tab) => tab.id === selectedId) ?? TABS[0]
  const openPath = (path) => {
    if (path) navigate(path)
  }

  const renderPanel = () => {
    if (selectedTab.id === 'daily') {
      return <DailyActivityList days={activity.daily ?? []} goal={dailyGoal} />
    }

    if (selectedTab.id === 'all') {
      return (
        <ActivityList
          items={activity.activity ?? []}
          title={selectedTab.emptyTitle}
          emptyMessage={selectedTab.emptyMessage}
          limit={12}
          onOpen={openPath}
        />
      )
    }

    return (
      <ActivityList
        items={activity[selectedTab.id] ?? []}
        title={selectedTab.emptyTitle}
        emptyMessage={selectedTab.emptyMessage}
        emptyActionLabel={selectedTab.emptyAction}
        onEmptyAction={() => openPath(selectedTab.path)}
        onOpen={openPath}
      />
    )
  }

  return (
    <section className="activity-tabs" aria-labelledby="activity-tabs-title">
      <div className="activity-tabs__heading">
        <span className="activity-tabs__kicker">Your journey</span>
        <h2 id="activity-tabs-title">Profile activity</h2>
        <p>{selectedTab.description}</p>
      </div>

      <div className="activity-tabs__list" role="tablist" aria-label="Profile activity">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === selectedTab.id

          return (
            <button
              key={tab.id}
              id={`activity-tab-${tab.id}`}
              className={isActive ? 'activity-tabs__tab activity-tabs__tab--active' : 'activity-tabs__tab'}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="activity-tab-panel"
              onClick={() => setSelectedId(tab.id)}
            >
              <Icon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        className="activity-tabs__panel"
        id="activity-tab-panel"
        role="tabpanel"
        aria-labelledby={`activity-tab-${selectedTab.id}`}
      >
        {renderPanel()}
      </div>
    </section>
  )
}

export default ActivityTabs
