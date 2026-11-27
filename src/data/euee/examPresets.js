export const EXAM_PRESETS = [
  {
    id: 'quick-test',
    title: 'Quick Test',
    description: 'A short mixed-subject check for a focused study break.',
    questionCount: 5,
    durationMinutes: 5,
    difficulty: 'mixed',
    subjectIds: [],
    icon: 'Timer',
    tone: 'blue',
  },
  {
    id: 'subject-mock',
    title: 'Subject Mock Exam',
    description: 'A focused timed exam for the subjects you select.',
    questionCount: 10,
    durationMinutes: 12,
    difficulty: 'medium',
    subjectIds: [],
    icon: 'BookOpen',
    tone: 'sky',
  },
  {
    id: 'full-mock',
    title: 'Full Mock Exam',
    description: 'A complete five-subject entrance exam simulation.',
    questionCount: 20,
    durationMinutes: 25,
    difficulty: 'mixed',
    subjectIds: ['mathematics', 'english', 'physics', 'chemistry', 'biology'],
    icon: 'GraduationCap',
    tone: 'navy',
  },
]

export function getExamPreset(presetId) {
  return EXAM_PRESETS.find((preset) => preset.id === presetId) ?? EXAM_PRESETS[0]
}
