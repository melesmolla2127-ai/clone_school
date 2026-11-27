import { BookOpen, CalendarCheck, Megaphone, Sparkles } from 'lucide-react'

export const announcements = [
  {
    id: 'materials',
    category: 'Learning',
    title: 'New learning materials available',
    message: 'Fresh notes and practice tasks are ready across your subjects.',
    date: 'Today',
    icon: BookOpen,
    tone: 'blue',
    featured: true,
  },
  {
    id: 'challenge',
    category: 'Challenge',
    title: 'Weekly learning challenge',
    message: 'Complete five study tasks this week to extend your streak.',
    date: 'This week',
    icon: Sparkles,
    tone: 'sky',
  },
  {
    id: 'examination',
    category: 'Reminder',
    title: 'Examination preparation reminder',
    message: 'Review your EUEE topics for a few minutes each day.',
    date: 'Upcoming',
    icon: CalendarCheck,
    tone: 'indigo',
  },
  {
    id: 'school',
    category: 'School',
    title: 'School announcement',
    message: 'Your updated weekly study schedule is now available.',
    date: 'Notice',
    icon: Megaphone,
    tone: 'navy',
  },
]
