import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './SpellingChallengeGame.css'

const game = getGameById('spelling-challenge')

const QUESTIONS = [
  { word: 'Calculate', hint: 'To work out a result using numbers.' },
  { word: 'Necessary', hint: 'Needed or required for a purpose.' },
  { word: 'Wednesday', hint: 'The day between Tuesday and Thursday.' },
  { word: 'Beautiful', hint: 'Pleasing to the senses or mind.' },
  { word: 'Knowledge', hint: 'Information gained through study or experience.' },
  { word: 'Environment', hint: 'The surroundings in which living things exist.' },
  { word: 'Library', hint: 'A place where books are kept and borrowed.' },
  { word: 'Curiosity', hint: 'A strong wish to learn or understand something.' },
]

function SpellingChallengeGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [reward, setReward] = useState(null)
  const finishedRef = useRef(false)
  const question = QUESTIONS[index]
  const isCorrect = answer.trim().toLowerCase() === question.word.toLowerCase()

  const finishGame = useCallback(
    (completed = false) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const xpEarned = Math.max(1, Math.round((score * 14 + (completed ? 30 : 0)) * game.xpMultiplier))
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
    setAnswer('')
    setChecked(false)
    setTimeLeft(90)
    setReward(null)
    setPhase('play')
  }, [])

  const handleCheck = (event) => {
    event.preventDefault()
    if (checked || !answer.trim()) return
    setChecked(true)
    if (isCorrect) setScore((value) => value + 1)
  }

  const handleNext = () => {
    if (index === QUESTIONS.length - 1) {
      finishGame(true)
      return
    }
    setIndex((value) => value + 1)
    setAnswer('')
    setChecked(false)
  }

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
        <div className="spelling-game">
          <div className="spelling-game__meta">
            <span>Word {index + 1} of {QUESTIONS.length}</span>
            <span className="spelling-game__timer">
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
          </div>
          <div className="spelling-game__hint">
            <span>Spell the word</span>
            <p>{question.hint}</p>
          </div>
          <form className="spelling-game__form" onSubmit={handleCheck}>
            <label htmlFor="spelling-answer">Your spelling</label>
            <input
              id="spelling-answer"
              type="text"
              autoComplete="off"
              spellCheck="false"
              placeholder="Type the word"
              value={answer}
              disabled={checked}
              onChange={(event) => setAnswer(event.target.value)}
            />
            {!checked && (
              <button type="submit" disabled={!answer.trim()}>
                Check spelling
              </button>
            )}
          </form>
          {checked && (
            <div
              className={isCorrect ? 'spelling-game__feedback spelling-game__feedback--correct' : 'spelling-game__feedback'}
              aria-live="polite"
            >
              {isCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              <div>
                <strong>{isCorrect ? 'Spelled correctly!' : `Correct spelling: ${question.word}`}</strong>
                <p>{question.word} — {question.hint}</p>
              </div>
            </div>
          )}
          {checked && (
            <button type="button" className="spelling-game__next" onClick={handleNext}>
              {index === QUESTIONS.length - 1 ? 'See results' : 'Next word'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === 'result' && (
        <div className="spelling-game__summary">
          You spelled {score} of {QUESTIONS.length} words correctly.
        </div>
      )}
    </GameShell>
  )
}

export default SpellingChallengeGame
