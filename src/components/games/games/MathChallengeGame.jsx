import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, Flame, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './MathChallengeGame.css'

const game = getGameById('math-challenge')
const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', detail: 'Numbers to 20' },
  { id: 'medium', label: 'Medium', detail: 'Tables to 12' },
  { id: 'hard', label: 'Hard', detail: 'Larger numbers' },
]
const OPERATOR_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' }

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildOptions(answer, spread) {
  const values = new Set([answer])
  let attempts = 0
  while (values.size < 4 && attempts < 40) {
    const delta = randomInt(-spread, spread) || 1
    values.add(Math.max(0, answer + delta))
    attempts += 1
  }
  while (values.size < 4) values.add(answer + values.size + 1)
  const options = [...values]
  for (let index = options.length - 1; index > 0; index -= 1) {
    const other = randomInt(0, index)
    const temporary = options[index]
    options[index] = options[other]
    options[other] = temporary
  }
  return options
}

function makeQuestion(difficulty) {
  const operations = difficulty === 'easy' ? ['+', '-', '*', '/'] : ['+', '-', '*', '/', '*', '/']
  const operation = operations[randomInt(0, operations.length - 1)]
  let first = 0
  let second = 0
  let answer = 0
  let spread = 4

  if (difficulty === 'easy') {
    spread = 3
    if (operation === '+') {
      first = randomInt(2, 12)
      second = randomInt(1, 8)
    } else if (operation === '-') {
      first = randomInt(6, 20)
      second = randomInt(1, first)
    } else if (operation === '*') {
      first = randomInt(1, 5)
      second = randomInt(1, 5)
    } else {
      second = randomInt(1, 5)
      answer = randomInt(1, 6)
      first = second * answer
    }
  } else if (difficulty === 'medium') {
    spread = 7
    if (operation === '+') {
      first = randomInt(18, 80)
      second = randomInt(7, 35)
    } else if (operation === '-') {
      first = randomInt(30, 100)
      second = randomInt(5, first)
    } else if (operation === '*') {
      first = randomInt(3, 9)
      second = randomInt(3, 12)
    } else {
      second = randomInt(2, 9)
      answer = randomInt(3, 12)
      first = second * answer
    }
  } else {
    spread = 14
    if (operation === '+') {
      first = randomInt(120, 480)
      second = randomInt(45, 220)
    } else if (operation === '-') {
      first = randomInt(220, 650)
      second = randomInt(40, first)
    } else if (operation === '*') {
      first = randomInt(7, 16)
      second = randomInt(6, 15)
    } else {
      second = randomInt(4, 15)
      answer = randomInt(6, 20)
      first = second * answer
    }
  }

  if (operation === '+') answer = first + second
  if (operation === '-') answer = first - second
  if (operation === '*') answer = first * second

  return {
    prompt: `${first} ${OPERATOR_SYMBOLS[operation]} ${second}`,
    answer,
    options: buildOptions(answer, spread),
    explanation: `${first} ${OPERATOR_SYMBOLS[operation]} ${second} = ${answer}`,
  }
}

function generateQuestions(difficulty) {
  return Array.from({ length: 8 }, () => makeQuestion(difficulty))
}

function MathChallengeGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState('easy')
  const [questions, setQuestions] = useState(() => generateQuestions('easy'))
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [reward, setReward] = useState(null)
  const finishedRef = useRef(false)
  const question = questions[index]

  const finishGame = useCallback(
    (completed = false) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const xpEarned = Math.max(
        1,
        Math.round((score * 12 + bestStreak * 4 + (completed ? 30 : 0)) * game.xpMultiplier),
      )
      const result = recordGameResult({
        gameId: game.id,
        title: game.title,
        score,
        total: questions.length,
        completed,
        category: game.category,
        xpEarned,
      })
      setReward(result)
      setPhase('result')
    },
    [bestStreak, questions.length, score],
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
    setQuestions(generateQuestions(difficulty))
    setIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setSelected(null)
    setTimeLeft(60)
    setReward(null)
    setPhase('play')
  }, [difficulty])

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    if (option === question.answer) {
      const nextStreak = streak + 1
      setScore((value) => value + 1)
      setStreak(nextStreak)
      setBestStreak((value) => Math.max(value, nextStreak))
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    if (index === questions.length - 1) {
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
      total={questions.length}
      reward={reward}
      isDaily={isDaily}
    >
      {phase === 'intro' && (
        <div className="math-game__difficulty" aria-label="Choose difficulty">
          <span>Difficulty</span>
          <div>
            {DIFFICULTIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  difficulty === item.id
                    ? 'math-game__level math-game__level--active'
                    : 'math-game__level'
                }
                onClick={() => setDifficulty(item.id)}
              >
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === 'play' && (
        <div className="math-game">
          <div className="math-game__meta">
            <span>Question {index + 1} of {questions.length}</span>
            <span className="math-game__timer">
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
            <span className="math-game__streak">
              <Flame size={14} aria-hidden="true" />
              {streak} streak
            </span>
          </div>
          <div className="math-game__prompt">
            <span>What is</span>
            <h2>{question.prompt}?</h2>
          </div>
          <div className="math-game__options">
            {question.options.map((option) => {
              const isAnswer = option === question.answer
              const isPicked = option === selected
              const optionClass = [
                'math-game__option',
                isPicked && (isAnswer ? 'math-game__option--correct' : 'math-game__option--wrong'),
                selected !== null && isAnswer && !isPicked ? 'math-game__option--answer' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={option}
                  type="button"
                  className={optionClass}
                  disabled={selected !== null}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              )
            })}
          </div>
          {selected !== null && (
            <div
              className={isCorrect ? 'math-game__feedback math-game__feedback--correct' : 'math-game__feedback'}
              aria-live="polite"
            >
              {isCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              <div>
                <strong>{isCorrect ? 'Correct!' : `Answer: ${question.answer}`}</strong>
                <p>{question.explanation}</p>
              </div>
            </div>
          )}
          {selected !== null && (
            <button type="button" className="math-game__next" onClick={handleNext}>
              {index === questions.length - 1 ? 'See results' : 'Next question'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === 'result' && (
        <div className="math-game__summary">
          Best streak: <strong>{bestStreak}</strong> · Difficulty: <strong>{DIFFICULTIES.find((item) => item.id === difficulty).label}</strong>
        </div>
      )}
    </GameShell>
  )
}

export default MathChallengeGame
