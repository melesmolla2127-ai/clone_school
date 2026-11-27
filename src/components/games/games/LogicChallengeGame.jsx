import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './LogicChallengeGame.css'

const game = getGameById('logic-challenge')

const QUESTIONS = [
  {
    pattern: '2, 4, 6, 8, ?',
    choices: ['9', '10', '11', '12'],
    answer: 1,
    explanation: 'The sequence adds 2 each time, so the next number is 10.',
  },
  {
    pattern: '3, 6, 12, 24, ?',
    choices: ['36', '42', '48', '54'],
    answer: 2,
    explanation: 'Each term doubles: 24 × 2 = 48.',
  },
  {
    pattern: '1, 4, 9, 16, ?',
    choices: ['20', '23', '25', '27'],
    answer: 2,
    explanation: 'These are square numbers: 1², 2², 3², 4², so next is 5² = 25.',
  },
  {
    pattern: '5, 10, 9, 18, 17, ?',
    choices: ['18', '30', '32', '34'],
    answer: 3,
    explanation: 'The rule alternates ×2 then −1: 17 × 2 = 34.',
  },
  {
    pattern: '100, 90, 81, 73, ?',
    choices: ['64', '65', '66', '67'],
    answer: 2,
    explanation: 'Subtract 10, then 9, then 8, then 7: 73 − 7 = 66.',
  },
  {
    pattern: '2, 6, 12, 20, 30, ?',
    choices: ['36', '40', '42', '44'],
    answer: 2,
    explanation: 'The terms are 1×2, 2×3, 3×4, 4×5, 5×6, so next is 6×7 = 42.',
  },
  {
    pattern: '7, 14, 28, 56, ?',
    choices: ['84', '98', '108', '112'],
    answer: 3,
    explanation: 'Each number doubles, so 56 × 2 = 112.',
  },
  {
    pattern: '3, 7, 15, 31, ?',
    choices: ['47', '55', '62', '63'],
    answer: 3,
    explanation: 'The rule is ×2 + 1 each time: 31 × 2 + 1 = 63.',
  },
]

function LogicChallengeGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(90)
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
    setTimeLeft(90)
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
        <div className="logic-game">
          <div className="logic-game__meta">
            <span>Puzzle {index + 1} of {QUESTIONS.length}</span>
            <span className="logic-game__timer">
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
          </div>
          <div className="logic-game__pattern">
            <span>Find the missing number</span>
            <h2>{question.pattern}</h2>
          </div>
          <div className="logic-game__options">
            {question.choices.map((choice, choiceIndex) => {
              const isAnswer = choiceIndex === question.answer
              const isPicked = choiceIndex === selected
              const optionClass = [
                'logic-game__option',
                isPicked && (isAnswer ? 'logic-game__option--correct' : 'logic-game__option--wrong'),
                selected !== null && isAnswer && !isPicked ? 'logic-game__option--answer' : '',
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
              className={isCorrect ? 'logic-game__feedback logic-game__feedback--correct' : 'logic-game__feedback'}
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
            <button type="button" className="logic-game__next" onClick={handleNext}>
              {index === QUESTIONS.length - 1 ? 'See results' : 'Next puzzle'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === 'result' && (
        <div className="logic-game__summary">
          You solved {score} of {QUESTIONS.length} logic puzzles correctly.
        </div>
      )}
    </GameShell>
  )
}

export default LogicChallengeGame
