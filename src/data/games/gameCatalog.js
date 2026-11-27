import { Brain, Calculator, FlaskConical, Hash, Languages, PenLine, Puzzle, Zap } from 'lucide-react'

export const games = [
  {
    id: 'math-challenge',
    title: 'Math Challenge',
    description: 'Solve generated arithmetic problems and build a correct-answer streak.',
    category: 'Mathematics',
    difficulty: 'Easy · Medium · Hard',
    icon: Calculator,
    tone: 'blue',
    instructions: [
      'Choose a difficulty and solve eight arithmetic questions.',
      'Pick the correct answer from four options.',
      'You have 60 seconds and earn streak bonuses along the way.',
    ],
    xpMultiplier: 1.2,
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Flip cards, remember symbol pairs, and clear the board in as few moves as possible.',
    category: 'Memory',
    difficulty: 'Medium',
    icon: Brain,
    tone: 'purple',
    instructions: [
      'Flip two cards at a time to find a matching pair.',
      'Matched cards stay open; unmatched cards flip back automatically.',
      'Find all six pairs before the 90-second timer ends.',
    ],
    xpMultiplier: 1,
  },
  {
    id: 'vocabulary-challenge',
    title: 'Vocabulary Challenge',
    description: 'Match eight words with their meanings and learn a new definition each round.',
    category: 'Languages',
    difficulty: 'Easy',
    icon: Languages,
    tone: 'green',
    instructions: [
      'Read the word and choose the definition that fits best.',
      'Feedback explains the correct meaning after every answer.',
      'Answer all eight questions before time runs out.',
    ],
    xpMultiplier: 1,
  },
  {
    id: 'spelling-challenge',
    title: 'Spelling Challenge',
    description: 'Use meaning-based hints to spell eight words correctly.',
    category: 'Languages',
    difficulty: 'Medium',
    icon: PenLine,
    tone: 'orange',
    instructions: [
      'Read the hint and type the word you think it describes.',
      'Check your answer, then move on to the next hint.',
      'You have 90 seconds to finish all eight words.',
    ],
    xpMultiplier: 1.1,
  },
  {
    id: 'science-quiz',
    title: 'Science Quiz',
    description: 'Test physics, chemistry, and biology knowledge with explained answers.',
    category: 'Science',
    difficulty: 'Medium',
    icon: FlaskConical,
    tone: 'cyan',
    instructions: [
      'Answer eight multiple-choice science questions.',
      'Every answer includes a short explanation.',
      'Finish within 75 seconds for the best result.',
    ],
    xpMultiplier: 1.2,
  },
  {
    id: 'speed-quiz',
    title: 'Speed Quiz',
    description: 'Ten rapid questions across subjects with bonus points for quick streaks.',
    category: 'Mixed',
    difficulty: 'Fast',
    icon: Zap,
    tone: 'amber',
    instructions: [
      'Answer ten quick questions in 45 seconds.',
      'Each correct answer earns 10 points.',
      'Consecutive correct answers add a five-point bonus.',
    ],
    xpMultiplier: 1.4,
  },
  {
    id: 'logic-challenge',
    title: 'Logic Challenge',
    description: 'Spot patterns, complete sequences, and solve missing-number puzzles.',
    category: 'Reasoning',
    difficulty: 'Hard',
    icon: Puzzle,
    tone: 'indigo',
    instructions: [
      'Study the number pattern in each question.',
      'Choose the missing value from four options.',
      'Explanations reveal the rule after each answer.',
    ],
    xpMultiplier: 1.3,
  },
  {
    id: 'number-challenge',
    title: 'Number Challenge',
    description: 'Work through eight mental-math puzzles that get harder each round.',
    category: 'Mathematics',
    difficulty: 'Progressive',
    icon: Hash,
    tone: 'rose',
    instructions: [
      'Solve eight number puzzles in increasing difficulty.',
      'Select the best answer from four choices.',
      'You have 80 seconds to complete the climb.',
    ],
    xpMultiplier: 1.2,
  },
]

export function getGameById(id) {
  return games.find((game) => game.id === id)
}

export const GAME_CATEGORIES = ['All', ...new Set(games.map((game) => game.category))]
