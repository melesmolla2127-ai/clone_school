import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './ScienceQuizGame.css'

const game = getGameById('science-quiz')

const QUESTIONS = [
  {
    question: 'Which gas do plants absorb during photosynthesis?',
    choices: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
    answer: 1,
    explanation: 'Plants take in carbon dioxide and use sunlight to make glucose, releasing oxygen.',
  },
  {
    question: 'What is the chemical symbol for gold?',
    choices: ['Ag', 'Fe', 'Au', 'Cu'],
    answer: 2,
    explanation: 'Au comes from the Latin name aurum, meaning glowing dawn.',
  },
  {
    question: 'Which force keeps planets in orbit around the Sun?',
    choices: ['Magnetism', 'Friction', 'Gravity', 'Tension'],
    answer: 2,
    explanation: 'The Sun’s gravity pulls planets inward while their sideways motion keeps them orbiting.',
  },
  {
    question: 'What is the SI unit of electric current?',
    choices: ['Volt', 'Ohm', 'Watt', 'Ampere'],
    answer: 3,
    explanation: 'Current is measured in amperes, named after André-Marie Ampère.',
  },
  {
    question: 'Which part of a cell contains most of its genetic material?',
    choices: ['Nucleus', 'Cell membrane', 'Cytoplasm', 'Ribosome'],
    answer: 0,
    explanation: 'The nucleus stores DNA and controls many cell activities.',
  },
  {
    question: 'At sea level, at what temperature does water boil?',
    choices: ['0°C', '50°C', '100°C', '150°C'],
    answer: 2,
    explanation: 'Water boils at 100°C under standard atmospheric pressure at sea level.',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    answer: 1,
    explanation: 'Iron oxide dust on the surface of Mars gives it a reddish appearance.',
  },
  {
    question: 'What type of energy does a moving object possess?',
    choices: ['Potential energy', 'Chemical energy', 'Kinetic energy', 'Nuclear energy'],
    answer: 2,
    explanation: 'Kinetic energy is the energy an object has because of its motion.',
  },
]

function ScienceQuizGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(75)
  const [reward, setReward] = useState(null)
  const finishedRef = useRef(false)
  const question = QUESTIONS[index]

  const finishGame = useCallback(
    (completed = false) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const xpEarned = Math.max(1, Math.round((score * 12 + (completed ? 30 : 0)) * game.xpMultiplier))
      const result = recordGameResult({
        gameId: game.id,
        title: game.title,
        score,
        total: QUESTIONS.length,
        completed,
        category: game.category,
        xpEarned,
      })
      setReward(result)
      setPhase('result')
    },
    [score],
  )

  useEffect(() => {
    if (phase !== 'play') return undefined
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'play' && timeLeft === 0) finishGame(false)
  }, [phase, timeLeft, finishGame])

  const startGame = useCallback(() => {
    finishedRef.current = false
    setIndex(0)
    setScore(0)
    setSelected(null)
    setTimeLeft(75)
    setReward(null)
    setPhase('play')
  }, [])

  const handleSelect = (choiceIndex) => {
    if (selected !== null) return
    setSelected(choiceIndex)
    if (choiceIndex === question.answer) setScore((value) => value + 1)
  }

  const handleNext = () => {
    if (index === QUESTIONS.length - 1) {
      finishGame(true)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
  }

  const isCorrect = selected === question.answer

  return (
    <GameShell
      game={game}
      phase={phase}
      onStart={startGame}
      onRestart={startGame}
      onExit={() => navigate('/games')}
      score={score}
      total={QUESTIONS.length}
      reward={reward}
      isDaily={isDaily}
    >
      {phase === 'play' && (
        <div className="science-game">
          <div className="science-game__meta">
            <span>Question {index + 1} of {QUESTIONS.length}</span>
            <span className="science-game__timer">
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
          </div>
          <h2 className="science-game__question">{question.question}</h2>
          <div className="science-game__options">
            {question.choices.map((choice, choiceIndex) => {
              const isAnswer = choiceIndex === question.answer
              const isPicked = choiceIndex === selected
              const optionClass = [
                'science-game__option',
                isPicked && (isAnswer ? 'science-game__option--correct' : 'science-game__option--wrong'),
                selected !== null && isAnswer && !isPicked ? 'science-game__option--answer' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={choice}
                  type="button"
                  className={optionClass}
                  disabled={selected !== null}
                  onClick={() => handleSelect(choiceIndex)}
                >
                  <span>{String.fromCharCode(65 + choiceIndex)}</span>
                  {choice}
                </button>
              )
            })}
          </div>
          {selected !== null && (
            <div
              className={isCorrect ? 'science-game__feedback science-game__feedback--correct' : 'science-game__feedback'}
              aria-live="polite"
            >
              {isCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              <div>
                <strong>{isCorrect ? 'Correct!' : `Answer: ${question.choices[question.answer]}`}</strong>
                <p>{question.explanation}</p>
              </div>
            </div>
          )}
          {selected !== null && (
            <button type="button" className="science-game__next" onClick={handleNext}>
              {index === QUESTIONS.length - 1 ? 'See results' : 'Next question'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === 'result' && (
        <div className="science-game__summary">
          You answered {score} of {QUESTIONS.length} science questions correctly.
        </div>
      )}
    </GameShell>
  )
}

export default ScienceQuizGame
