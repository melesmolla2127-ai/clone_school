import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './VocabularyChallengeGame.css'

const game = getGameById('vocabulary-challenge')

const QUESTIONS = [
  {
    word: 'Abundant',
    choices: ['Scarce', 'Plentiful', 'Hidden', 'Temporary'],
    answer: 1,
    explanation: 'Abundant means existing in large quantities.',
  },
  {
    word: 'Candid',
    choices: ['Reserved', 'Formal', 'Honest', 'Careless'],
    answer: 2,
    explanation: 'A candid person speaks honestly and directly.',
  },
  {
    word: 'Diligent',
    choices: ['Hardworking', 'Carefree', 'Noisy', 'Brief'],
    answer: 0,
    explanation: 'Diligent describes someone who works steadily and carefully.',
  },
  {
    word: 'Fragile',
    choices: ['Strong', 'Flexible', 'Heavy', 'Easily broken'],
    answer: 3,
    explanation: 'Something fragile can be damaged or broken easily.',
  },
  {
    word: 'Concise',
    choices: ['Detailed', 'Brief', 'Repeated', 'Unclear'],
    answer: 1,
    explanation: 'Concise writing uses few words while keeping the meaning.',
  },
  {
    word: 'Resilient',
    choices: ['Quick to recover', 'Easily tired', 'Rigid', 'Uncertain'],
    answer: 0,
    explanation: 'A resilient person or thing recovers after difficulty.',
  },
  {
    word: 'Ambiguous',
    choices: ['Obvious', 'Precise', 'Open to more than one meaning', 'Ancient'],
    answer: 2,
    explanation: 'Ambiguous language can be understood in more than one way.',
  },
  {
    word: 'Meticulous',
    choices: ['Careless', 'Very attentive to detail', 'Speedy', 'Ordinary'],
    answer: 1,
    explanation: 'Meticulous means showing great care for small details.',
  },
]

function VocabularyChallengeGame({ isDaily = false }) {
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
        <div className="vocab-game">
          <div className="vocab-game__meta">
            <span>Question {index + 1} of {QUESTIONS.length}</span>
            <span className="vocab-game__timer">
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
          </div>
          <div className="vocab-game__word">
            <span>Choose the meaning of</span>
            <h2>{question.word}</h2>
          </div>
          <div className="vocab-game__options">
            {question.choices.map((choice, choiceIndex) => {
              const isAnswer = choiceIndex === question.answer
              const isPicked = choiceIndex === selected
              const optionClass = [
                'vocab-game__option',
                isPicked && (isAnswer ? 'vocab-game__option--correct' : 'vocab-game__option--wrong'),
                selected !== null && isAnswer && !isPicked ? 'vocab-game__option--answer' : '',
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
              className={isCorrect ? 'vocab-game__feedback vocab-game__feedback--correct' : 'vocab-game__feedback'}
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
            <button type="button" className="vocab-game__next" onClick={handleNext}>
              {index === QUESTIONS.length - 1 ? 'See results' : 'Next word'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === 'result' && (
        <div className="vocab-game__summary">
          You answered {score} of {QUESTIONS.length} word meanings correctly.
        </div>
      )}
    </GameShell>
  )
}

export default VocabularyChallengeGame
