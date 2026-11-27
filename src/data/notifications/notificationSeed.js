const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60000).toISOString()

export function createSeedNotifications() {
  return [
    {
      id: 'welcome-notification',
      category: 'system',
      title: 'Welcome to Clone School',
      message: 'Your student space is ready. Explore courses, games, and EUEE practice.',
      createdAt: minutesAgo(2),
      read: false,
      actionPath: '/home',
      iconName: 'Sparkles',
    },
    {
      id: 'course-start-notification',
      category: 'courses',
      title: 'Continue your learning path',
      message: 'Open Courses to pick up the unit you were studying.',
      createdAt: minutesAgo(55),
      read: false,
      actionPath: '/courses',
      iconName: 'BookOpen',
    },
    {
      id: 'daily-challenge-notification',
      category: 'games',
      title: 'Daily challenge is available',
      message: 'Play the Math Challenge and keep your learning streak alive.',
      createdAt: minutesAgo(180),
      read: true,
      actionPath: '/games/math-challenge?daily=1',
      iconName: 'Trophy',
    },
    {
      id: 'euee-start-notification',
      category: 'euee',
      title: 'EUEE preparation is ready',
      message: 'Take a short practice set or try a timed mock exam.',
      createdAt: minutesAgo(420),
      read: true,
      actionPath: '/euee',
      iconName: 'GraduationCap',
    },
  ]
}
