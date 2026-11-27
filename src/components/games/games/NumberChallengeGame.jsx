import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './NumberChallengeGame.css'

const game = getGameById('number-challenge')

const QUESTIONS = [
  {
    question: 'What is 24 + 17?',
    choices: ['38', '39', '41', '43'],
    answer: 2,
    explanation: '24 + 17 = 24 + 10 + 7 = 41.',
  },
  {
    question: 'What is 9 × 6?',
    choices: ['45', '54', '56', '63'],
    answer: 1,
    explanation: 'Nine groups of six make 54.',
  },
  {
    question: 'What is half of 82?',
    choices: ['41', '42', '44', '46'],
    answer: 0,
    explanation: '82 ÷ 2 = 41, so half of 82 is 41.',
  },
  {
    question: 'What is 120 ÷ 8?',
    choices: ['12', '14', '15', '18'],
    answer: 2,
    explanation: '8 × 15 = 120, so the quotient is 15.',
  },
  {
    question: 'What is 25% of 160?',
    choices: ['30', '40', '45', '50'],
    answer: 1,
    explanation: '25% is one quarter, and 160 ÷ 4 = 40.',
  },
  {
    question: 'What is 7 × 8 − 16?',
    choices: ['32', '38', '40', '48'],
    answer: 2,
    explanation: '7 × 8 = 56, then 56 − 16 = 40.',
  },
  {
    question: 'What is 12² − 11²?',
    choices: ['21', '23', '25', '27'],
    answer: 1,
    explanation: '144 − 121 = 23. The difference of consecutive squares is 2n + 1.',
  },
  {
    question: 'What is three quarters of 240, minus 35?',
    choices: ['125', '135', '140', '145'],
    answer: 3,
    explanation: '240 × 3/4 = 180, then 180 − 35 = 145.',
  },
]

function NumberChallengeGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(80)
  const [reward, setReward] = useState(null)
  const finishedRef = useRef(false)
  const question = QUESTIONS[index]

  const finishGame = useCallback(
    (completed = false) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const xpEarned = Math.max(1, Math.round((score * 13 + (completed ? 30 : 0)) * game.xpMultiplier))
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
    setTimeLeft(80)
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
        <div className="number-game">
          <div className="number-game__meta">
            <span className="number-game__level">Level {index + 1}/{QUESTIONS.length}</span>
            <span className="number-game__timer">
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
          </div>
          <h2 className="number-game__question">{question.question}</h2>
          <div className="number-game__options">
            {question.choices.map((choice, choiceIndex) => {
              const isAnswer = choiceIndex === question.answer
              const isPicked = choiceIndex === selected
              const optionClass = [
                'number-game__option',
                isPicked && (isAnswer ? 'number-game__option--correct' : 'number-game__option--wrong'),
                selected !== null && isAnswer && !isPicked ? 'number-game__option--answer' : '',
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
                  {choice}
                </button>
              )
            })}
          </div>
          {selected !== null && (
            <div
              className={isCorrect ? 'number-game__feedback number-game__feedback--correct' : 'number-game__feedback'}
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
            <button type="button" className="number-game__next" onClick={handleNext}>
              {index === QUESTIONS.length - 1 ? 'See results' : 'Next level'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === 'result' && (
        <div className="number-game__summary">
          You cleared {score} of {QUESTIONS.length} number levels.
        </div>
      )}
    </GameShell>
  )
}

export default NumberChallengeGame
