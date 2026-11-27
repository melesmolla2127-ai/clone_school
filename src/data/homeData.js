import {
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ClipboardList,
  Flame,
  Gamepad2,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react'

export const learningStats = [
  {
    id: 'subjects',
    label: 'Subjects',
    value: '6',
    caption: 'this term',
    icon: BookOpen,
    tone: 'blue',
  },
  {
    id: 'goal',
    label: 'Daily goal',
    value: '2/5',
    caption: 'tasks complete',
    icon: ClipboardList,
    tone: 'sky',
  },
  {
    id: 'streak',
    label: 'Study streak',
    value: '4 days',
    caption: 'keep it going',
    icon: Flame,
    tone: 'navy',
  },
  {
    id: 'progress',
    label: 'Weekly progress',
    value: '65%',
    caption: 'weekly goal',
    icon: TrendingUp,
    tone: 'indigo',
    percent: 65,
  },
]

export const quickAccessItems = [
  {
    id: 'continue-learning',
    title: 'Continue Learning',
    description: 'Pick up your last lesson',
    icon: BookOpen,
    path: '/continue-learning',
    tone: 'blue',
  },
  {
    id: 'practice',
    title: 'Practice Questions',
    description: 'Sharpen what you know',
    icon: ClipboardList,
    path: '/practice',
    tone: 'sky',
  },
  {
    id: 'games',
    title: 'Educational Games',
    description: 'Learn through play',
    icon: Gamepad2,
    path: '/games',
    tone: 'navy',
  },
  {
    id: 'euee',
    title: 'EUEE Preparation',
    description: 'Focused exam readiness',
    icon: GraduationCap,
    path: '/euee',
    tone: 'indigo',
  },
  {
    id: 'ai-assistant',
    title: 'AI Study Assistant',
    description: 'Ask a study question',
    icon: BrainCircuit,
    path: '/ai-assistant',
    tone: 'cyan',
  },
  {
    id: 'schedule',
    title: 'Study Schedule',
    description: 'Plan your study time',
    icon: CalendarDays,
    path: '/schedule',
    tone: 'blue',
  },
]

export const continueLearning = {
  subject: 'Mathematics',
  topic: 'Linear Equations · Unit 4',
  nextLesson: 'Solving one-variable equations',
  progress: 68,
  icon: BookOpen,
  path: '/continue-learning',
}

export const dailyChallenge = {
  title: 'Algebra Sprint',
  description: 'Answer 10 quick questions and keep your streak alive.',
  points: 120,
  path: '/games/math-challenge?daily=1',
  icon: Trophy,
}

export const aiAssistant = {
  title: 'Ask Clone AI',
  description: 'Stuck on a topic? Ask a question and get a clear starting point.',
  path: '/ai-assistant',
  icon: Sparkles,
}

export const introHighlights = [
  'Learn anywhere at your own pace',
  'Build knowledge one lesson at a time',
  'Practice for exams with focused tasks',
]
