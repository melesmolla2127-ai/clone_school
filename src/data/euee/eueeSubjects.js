import { Atom, Dna, FlaskConical, Languages, Sigma } from 'lucide-react'

export const EUEE_SUBJECTS = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Number sense, algebra, geometry, and data interpretation.',
    icon: Sigma,
    tone: 'blue',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    id: 'english',
    name: 'English',
    description: 'Grammar, vocabulary, reading, and written expression.',
    icon: Languages,
    tone: 'sky',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Motion, forces, electricity, waves, and energy.',
    icon: Atom,
    tone: 'indigo',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Atoms, bonding, reactions, and everyday materials.',
    icon: FlaskConical,
    tone: 'teal',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Cells, genetics, ecology, and the human body.',
    icon: Dna,
    tone: 'green',
    difficulties: ['easy', 'medium', 'hard'],
  },
]

export const EUEE_SUBJECT_MAP = Object.fromEntries(
  EUEE_SUBJECTS.map((subject) => [subject.id, subject]),
)

export const EUEE_DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export const EUEE_QUESTION_TYPES = [
  { id: 'multiple-choice', label: 'Multiple choice' },
  { id: 'numerical', label: 'Numerical' },
  { id: 'conceptual', label: 'Conceptual' },
]

export function getEueeSubject(subjectId) {
  return EUEE_SUBJECT_MAP[subjectId] ?? null
}
