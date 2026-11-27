import {
  Atom,
  BookText,
  BriefcaseBusiness,
  Calculator,
  Dna,
  FlaskConical,
  History,
  Languages,
  Lightbulb,
  MapPinned,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { FINAL_GRADES } from '../options.js'

export const UNIT_COUNT = 8
export const NOTE_COUNT_PER_UNIT = 3
export const VIDEO_COUNT_PER_UNIT = 8
export const QUESTION_COUNT_PER_UNIT = 60

const SUBJECT_LIBRARY = {
  'kg-explorer': {
    id: 'kg-explorer',
    title: 'KG Explorers',
    icon: Sparkles,
    tone: 'amber',
    description: 'Playful early learning with stories, sounds, numbers, and colors.',
  },
  mathematics: {
    id: 'mathematics',
    title: 'Mathematics',
    icon: Calculator,
    tone: 'blue',
    description: 'Build number sense, problem solving, and confident calculation.',
  },
  english: {
    id: 'english',
    title: 'English',
    icon: BookText,
    tone: 'sky',
    description: 'Grow reading, writing, grammar, and communication skills.',
  },
  amharic: {
    id: 'amharic',
    title: 'Amharic',
    icon: Languages,
    tone: 'violet',
    description: 'Develop fluency in Amharic reading, writing, and expression.',
  },
  'general-science': {
    id: 'general-science',
    title: 'General Science',
    icon: Lightbulb,
    tone: 'green',
    description: 'Explore the natural world through observation and simple experiments.',
  },
  'career-education': {
    id: 'career-education',
    title: 'Career Education',
    icon: BriefcaseBusiness,
    tone: 'rose',
    description: 'Discover strengths, interests, and future learning pathways.',
  },
  physics: {
    id: 'physics',
    title: 'Physics',
    icon: Atom,
    tone: 'indigo',
    description: 'Understand motion, forces, energy, waves, and the physical world.',
  },
  chemistry: {
    id: 'chemistry',
    title: 'Chemistry',
    icon: FlaskConical,
    tone: 'teal',
    description: 'Study matter, reactions, atoms, and everyday chemical changes.',
  },
  biology: {
    id: 'biology',
    title: 'Biology',
    icon: Dna,
    tone: 'green',
    description: 'Learn about cells, organisms, systems, and living environments.',
  },
  history: {
    id: 'history',
    title: 'History',
    icon: History,
    tone: 'amber',
    description: 'Explore people, events, and ideas that shaped our world.',
  },
  geography: {
    id: 'geography',
    title: 'Geography',
    icon: MapPinned,
    tone: 'cyan',
    description: 'Study places, maps, climates, and human environments.',
  },
  economics: {
    id: 'economics',
    title: 'Economics',
    icon: TrendingUp,
    tone: 'rose',
    description: 'Understand choices, markets, resources, and everyday decisions.',
  },
}

const SUBJECT_SETS = {
  kg: ['kg-explorer'],
  elementary: ['mathematics', 'english', 'amharic', 'general-science', 'career-education'],
  secondary: ['mathematics', 'english', 'physics', 'chemistry', 'biology'],
  'natural-science': ['mathematics', 'english', 'physics', 'chemistry', 'biology'],
  'social-science': ['mathematics', 'english', 'history', 'geography', 'economics'],
}

const UNIT_TITLES = {
  'kg-explorer': ['Colors and Shapes', 'Letters and Sounds', 'Numbers to Ten', 'My Family', 'Animals Around Us', 'Days and Seasons', 'Sharing and Caring', 'Creative Play'],
  mathematics: ['Numbers and Place Value', 'Operations and Calculation', 'Fractions and Decimals', 'Measurement', 'Geometry and Shapes', 'Patterns and Algebra', 'Data and Graphs', 'Problem Solving'],
  english: ['Reading for Meaning', 'Vocabulary Building', 'Grammar Essentials', 'Sentence Skills', 'Writing Paragraphs', 'Listening and Speaking', 'Literary Devices', 'Review and Practice'],
  amharic: ['Letters and Sounds', 'Word Building', 'Reading Fluency', 'Sentence Structure', 'Writing Practice', 'Stories and Culture', 'Vocabulary Growth', 'Review and Practice'],
  'general-science': ['Living Things', 'Matter and Materials', 'Forces and Motion', 'Earth and Weather', 'Light and Sound', 'Plants and Animals', 'Health and Safety', 'Science in Daily Life'],
  'career-education': ['Knowing Myself', 'Learning Styles', 'Subjects and Careers', 'Communication Skills', 'Teamwork', 'Decision Making', 'Future Planning', 'Review and Practice'],
  physics: ['Motion and Forces', 'Energy and Work', 'Waves and Sound', 'Light and Optics', 'Electricity', 'Magnetism', 'Heat and Temperature', 'Review and Practice'],
  chemistry: ['Atoms and Elements', 'Molecules and Bonds', 'States of Matter', 'Chemical Reactions', 'Acids and Bases', 'Solutions and Mixtures', 'Metals and Non-metals', 'Review and Practice'],
  biology: ['Cells and Life', 'Plant Biology', 'Human Body Systems', 'Reproduction and Growth', 'Ecology and Environment', 'Genetics Basics', 'Health and Disease', 'Review and Practice'],
  history: ['Early Civilizations', 'Ancient Ethiopia', 'Kingdoms and Empires', 'Trade and Culture', 'Modern History', 'World Conflicts', 'Leaders and Change', 'Review and Practice'],
  geography: ['Maps and Globes', 'Earth Features', 'Climate and Weather', 'Natural Resources', 'Population and Settlements', 'Continents and Regions', 'Human Environment', 'Review and Practice'],
  economics: ['Basic Economic Ideas', 'Needs and Wants', 'Production and Goods', 'Markets and Prices', 'Money and Banking', 'Trade and Business', 'Government and Economy', 'Review and Practice'],
}

const UNIT_DESCRIPTIONS = {
  'kg-explorer': 'A playful theme with short activities, colorful examples, and simple practice.',
  mathematics: 'A focused mathematics unit with guided examples and practice tasks.',
  english: 'A language unit built around reading, vocabulary, and clear expression.',
  amharic: 'An Amharic literacy unit with reading, vocabulary, and writing practice.',
  'general-science': 'A science unit connecting key ideas to everyday observations.',
  'career-education': 'A reflective unit that helps connect learning to future pathways.',
  physics: 'A physics unit combining core concepts with practical reasoning.',
  chemistry: 'A chemistry unit explaining matter and change with clear examples.',
  biology: 'A biology unit exploring living systems and their relationships.',
  history: 'A history unit connecting events, people, and change over time.',
  geography: 'A geography unit exploring places, patterns, and human environments.',
  economics: 'An economics unit explaining choices, resources, and markets.',
}

const NOTE_TYPES = ['Study guide', 'Example sheet', 'Quick reference']
const VIDEO_DURATIONS = ['05:12', '06:24', '07:08', '08:16', '06:45', '09:02', '07:31', '05:56']

function getUnitTitle(subjectId, index) {
  return UNIT_TITLES[subjectId]?.[index] || `Unit ${index + 1}`
}

function buildUnits(subject) {
  return Array.from({ length: UNIT_COUNT }, (_, index) => {
    const number = index + 1
    const title = getUnitTitle(subject.id, index)
    return {
      id: `unit-${number}`,
      number,
      title,
      description: UNIT_DESCRIPTIONS[subject.id] || 'A structured learning unit with guided practice.',
      objectives: [
        `Understand the main ideas in ${title.toLowerCase()}.`,
        `Apply key skills through guided examples.`,
        `Check understanding with short practice questions.`,
      ],
      noteCount: NOTE_COUNT_PER_UNIT,
      videoCount: VIDEO_COUNT_PER_UNIT,
      questionCount: QUESTION_COUNT_PER_UNIT,
    }
  })
}

function buildSubjects(subjectIds) {
  return subjectIds
    .map((id) => SUBJECT_LIBRARY[id])
    .filter(Boolean)
    .map((subject) => ({ ...subject, units: buildUnits(subject) }))
}

function normalizeGrade(value) {
  return String(value ?? '').trim()
}

function getLevel(grade) {
  if (!grade) return null
  if (grade.toUpperCase() === 'KG') return 'kg'
  const numeric = Number(grade)
  if (!Number.isFinite(numeric)) return null
  if (numeric >= 1 && numeric <= 8) return 'elementary'
  if (numeric === 9 || numeric === 10) return 'secondary'
  if (FINAL_GRADES.includes(grade)) return 'preparatory'
  return null
}

export function getCourseContext(student, selectedGrade, selectedStream) {
  const grade = normalizeGrade(selectedGrade || student?.grade)
  const level = getLevel(grade)
  const stream = FINAL_GRADES.includes(grade) ? normalizeGrade(selectedStream || student?.stream) : ''
  const streamKey = stream.toLowerCase().replace(/\s+/g, '-')
  const subjectSet = level === 'preparatory' ? streamKey : level
  const needsStreamSelection = level === 'preparatory' && !stream
  const subjects = needsStreamSelection ? [] : buildSubjects(SUBJECT_SETS[subjectSet] || [])

  return {
    grade,
    level,
    stream,
    needsStreamSelection,
    subjects,
    totalUnits: subjects.length * UNIT_COUNT,
    title:
      level === 'kg'
        ? 'Kindergarten'
        : level === 'elementary'
          ? `Grade ${grade}`
          : level === 'secondary'
            ? `Grade ${grade}`
            : needsStreamSelection
              ? 'Grade ' + grade
              : `${stream} · Grade ${grade}`,
  }
}

export function getSubject(context, subjectId) {
  return context.subjects.find((subject) => subject.id === subjectId) || null
}

export function getUnit(subject, unitId) {
  return subject?.units.find((unit) => unit.id === unitId) || null
}

export function getUnitResources(subject, unit) {
  if (!subject || !unit) return { notes: [], videos: [], questionCount: 0 }

  return {
    notes: Array.from({ length: NOTE_COUNT_PER_UNIT }, (_, index) => ({
      id: `${subject.id}-${unit.id}-note-${index + 1}`,
      title: `${unit.title} · ${NOTE_TYPES[index]}`,
      type: NOTE_TYPES[index],
      unit: `Unit ${unit.number}`,
      preview: `This ${NOTE_TYPES[index].toLowerCase()} covers the core ideas of ${unit.title.toLowerCase()} with short examples and a checklist for review.`,
    })),
    videos: Array.from({ length: VIDEO_COUNT_PER_UNIT }, (_, index) => ({
      id: `${subject.id}-${unit.id}-video-${index + 1}`,
      title: `${unit.title} · Lesson ${index + 1}`,
      duration: VIDEO_DURATIONS[index],
      unit: `Unit ${unit.number}`,
      index: index + 1,
    })),
    questionCount: QUESTION_COUNT_PER_UNIT,
  }
}

export function getKgResources() {
  return {
    videos: Array.from({ length: 40 }, (_, index) => ({
      id: `kg-video-${index + 1}`,
      title: `KG Adventure · ${getUnitTitle('kg-explorer', index % UNIT_COUNT)} ${Math.floor(index / UNIT_COUNT) + 1}`,
      duration: VIDEO_DURATIONS[index % VIDEO_DURATIONS.length],
      unit: 'KG library',
    })),
    notes: Array.from({ length: 25 }, (_, index) => ({
      id: `kg-note-${index + 1}`,
      title: `KG Activity Sheet ${index + 1}`,
      type: index % 2 === 0 ? 'Picture sheet' : 'Practice sheet',
      unit: 'KG library',
      preview: 'A short early-learning activity with simple instructions and space to practice.',
    })),
    questionCount: QUESTION_COUNT_PER_UNIT,
  }
}

export function getLevelBadge(level) {
  if (level === 'kg') return 'KG learning'
  if (level === 'elementary') return 'Elementary'
  if (level === 'secondary') return 'Secondary'
  if (level === 'preparatory') return 'Preparatory'
  return 'Courses'
}
