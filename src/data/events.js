import { CalendarDays, ClipboardList, Flame, GraduationCap } from 'lucide-react'

export const upcomingEvents = [
  {
    id: 'weekly-quiz',
    title: 'Weekly Quiz',
    date: 'Fri, 28 Nov',
    category: 'Quiz',
    description: 'A quick check-in on this week’s topics.',
    icon: ClipboardList,
  },
  {
    id: 'mock-exam',
    title: 'Mock Examination',
    date: 'Mon, 1 Dec',
    category: 'Exam',
    description: 'Practice exam conditions and timing.',
    icon: GraduationCap,
  },
  {
    id: 'study-challenge',
    title: 'Study Challenge',
    date: 'Wed, 3 Dec',
    category: 'Challenge',
    description: 'Reach your daily learning goal.',
    icon: Flame,
  },
  {
    id: 'science-event',
    title: 'Science Learning Event',
    date: 'Sat, 6 Dec',
    category: 'Event',
    description: 'Explore key science ideas through short tasks.',
    icon: CalendarDays,
  },
]
