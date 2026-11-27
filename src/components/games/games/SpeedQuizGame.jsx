import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, Flame, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './SpeedQuizGame.css'

const game = getGameById('speed-quiz')

const QUESTIONS = [
  { question: '7 × 8 = ?', choices: ['48', '54', '56', '64'], answer: 2 },
  { question: 'What is the capital of France?', choices: ['Lyon', 'Paris', 'Marseille', 'Nice'], answer: 1 },
  { question: 'What is H₂O commonly known as?', choices: ['Salt', 'Oxygen', 'Water', 'Acid'], answer: 2 },
  { question: 'What is the square root of 81?', choices: ['7', '8', '9', '11'], answer: 2 },
  { question: 'Which planet is closest to the Sun?', choices: ['Venus', 'Mercury', 'Earth', 'Mars'], answer: 1 },
  { question: 'What is 15% of 200?', choices: ['15', '25', '30', '35'], answer: 2 },
  { question: 'Which word is the opposite of ancient?', choices: ['Old', 'Modern', 'Historic', 'Classic'], answer: 1 },
  { question: '144 ÷ 12 = ?', choices: ['11', '12', '14', '16'], answer: 1 },
  { question: 'Which gas is most abundant in Earth’s atmosphere?', choices: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], answer: 2 },
  { question: 'What is the next prime number after 19?', choices: ['21', '23', '25', '27'], answer: 1 },
]

function SpeedQuizGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastGain, setLastGain] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(45)
  const [reward, setReward] = useState(null)
  const finishedRef = useRef(false)
  const question = QUESTIONS[index]

  const finishGame = useCallback(
    (completed = false) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const xpEarned = Math.max(
        1,
        Math.round((correctCount * 12 + score - correctCount * 10 + (completed ? 30 : 0)) * game.xpMultiplier),
      )
      const result = recordGameResult({
        gameId: game.id,
        title: game.title,
        score,
        total: QUESTIONS.length * 10,
        completed,
        category: game.category,
        xpEarned,
      })
      setReward(result)
      setPhase('result')
    },
    [correctCount, score],
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
    setCorrectCount(0)
    setStreak(0)
    setLastGain(0)
    setSelected(null)
    setTimeLeft(45)
    setReward(null)
    setPhase('play')
  }, [])

  const handleSelect = (choiceIndex) => {
    if (selected !== null) return
    setSelected(choiceIndex)
    if (choiceIndex === question.answer) {
      const nextStreak = streak + 1
      const gained = 10 + (nextStreak >= 2 ? (nextStreak - 1) * 5 : 0)
      setCorrectCount((value) => value + 1)
      setStreak(nextStreak)
      setScore((value) => value + gained)
      setLastGain(gained)
    } else {
      setStreak(0)
      setLastGain(0)
    }
  }

  const handleNext = () => {
    if (index === QUESTIONS.length - 1) {
      finishGame(true)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
    setLastGain(0)
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
      total={QUESTIONS.length * 10}
      reward={reward}
      isDaily={isDaily}
    >
      {phase === 'play' && (
        <div className="speed-game">
          <div className="speed-game__top">
            <span className="speed-game__timer">
              <Clock size={16} aria-hidden="true" />
              {timeLeft}s
            </span>
            <span className="speed-game__streak">
              <Flame size={14} aria-hidden="true" />
              {streak} in a row
            </span>
          </div>
          <div className="speed-game__question">
            <span>Question {index + 1}/{QUESTIONS.length}</span>
            <h2>{question.question}</h2>
          </div>
          <div className="speed-game__options">
            {question.choices.map((choice, choiceIndex) => {
              const isAnswer = choiceIndex === question.answer
              const isPicked = choiceIndex === selected
              const optionClass = [
                'speed-game__option',
                isPicked && (isAnswer ? 'speed-game__option--correct' : 'speed-game__option--wrong'),
                selected !== null && isAnswer && !isPicked ? 'speed-game__option--answer' : '',
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
          <div className="speed-game__bottom" aria-live="polite">
            {selected === null ? (
              <span>Pick an answer fast to keep your bonus.</span>
            ) : (
              <span className={isCorrect ? 'speed-game__gain' : ''}>
                {isCorrect ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
                {isCorrect ? `+${lastGain} points` : 'Streak reset'}
              </span>
            )}
            {selected !== null && (
              <button type="button" onClick={handleNext}>
                {index === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
      {phase === 'result' && (
        <div className="speed-game__summary">
          Correct answers: <strong>{correctCount}</strong> of {QUESTIONS.length} · Bonus points included in your score.
        </div>
      )}
    </GameShell>
  )
}

export default SpeedQuizGame
