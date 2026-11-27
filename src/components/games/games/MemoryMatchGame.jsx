import { useCallback, useEffect, useRef, useState } from 'react'
import { Clock, Cloud, Heart, Layers, Moon, Sparkles, Star, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../GameShell'
import { getGameById } from '../../../data/games/gameCatalog'
import { recordGameResult } from '../../../services/gameProgress'
import './MemoryMatchGame.css'

const game = getGameById('memory-match')

const PAIRS = [
  { id: 'star', label: 'Star', icon: Star },
  { id: 'sun', label: 'Sun', icon: Sun },
  { id: 'moon', label: 'Moon', icon: Moon },
  { id: 'cloud', label: 'Cloud', icon: Cloud },
  { id: 'heart', label: 'Heart', icon: Heart },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
]

function shuffle(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    const temporary = copy[index]
    copy[index] = copy[other]
    copy[other] = temporary
  }
  return copy
}

function buildDeck() {
  return shuffle(
    PAIRS.flatMap((pair, index) => [
      { key: `${pair.id}-a-${index}`, pairId: pair.id, label: pair.label, icon: pair.icon },
      { key: `${pair.id}-b-${index}`, pairId: pair.id, label: pair.label, icon: pair.icon },
    ]),
  )
}

function MemoryMatchGame({ isDaily = false }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [cards, setCards] = useState(buildDeck)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [locked, setLocked] = useState(false)
  const [reward, setReward] = useState(null)
  const flipTimeoutRef = useRef(null)
  const finishedRef = useRef(false)

  const finishGame = useCallback(
    (completed = false) => {
      if (finishedRef.current) return
      finishedRef.current = true
      if (flipTimeoutRef.current) {
        window.clearTimeout(flipTimeoutRef.current)
        flipTimeoutRef.current = null
      }
      const xpEarned = Math.max(1, Math.round((score * 18 + (completed ? 40 : 0)) * game.xpMultiplier))
      const result = recordGameResult({
        gameId: game.id,
        title: game.title,
        score,
        total: PAIRS.length,
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

  useEffect(() => {
    if (phase === 'play' && matched.length === PAIRS.length) finishGame(true)
  }, [phase, matched.length, finishGame])

  useEffect(
    () => () => {
      if (flipTimeoutRef.current) window.clearTimeout(flipTimeoutRef.current)
    },
    [],
  )

  const startGame = useCallback(() => {
    if (flipTimeoutRef.current) {
      window.clearTimeout(flipTimeoutRef.current)
      flipTimeoutRef.current = null
    }
    finishedRef.current = false
    setCards(buildDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setScore(0)
    setTimeLeft(90)
    setLocked(false)
    setReward(null)
    setPhase('play')
  }, [])

  const handleFlip = (index) => {
    if (locked || flipped.includes(index) || matched.includes(cards[index].pairId)) return
    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)
    if (nextFlipped.length === 1) return

    setMoves((value) => value + 1)
    const firstCard = cards[nextFlipped[0]]
    const secondCard = cards[index]
    if (firstCard.pairId === secondCard.pairId) {
      const nextMatched = [...matched, firstCard.pairId]
      setMatched(nextMatched)
      setScore(nextMatched.length)
      setFlipped([])
      return
    }

    setLocked(true)
    flipTimeoutRef.current = window.setTimeout(() => {
      setFlipped([])
      setLocked(false)
      flipTimeoutRef.current = null
    }, 700)
  }

  return (
    <GameShell
      game={game}
      phase={phase}
      onStart={startGame}
      onRestart={startGame}
      onExit={() => navigate('/games')}
      score={score}
      total={PAIRS.length}
      reward={reward}
      isDaily={isDaily}
    >
      {phase === 'play' && (
        <div className="memory-game">
          <div className="memory-game__meta">
            <span>
              <Clock size={14} aria-hidden="true" />
              {timeLeft}s
            </span>
            <span>{matched.length}/{PAIRS.length} pairs</span>
            <span>{moves} moves</span>
          </div>
          <div className="memory-game__grid">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index)
              const isMatched = matched.includes(card.pairId)
              const Icon = card.icon
              const cardClass = [
                'memory-card',
                isFlipped || isMatched ? 'memory-card--flipped' : '',
                isMatched ? 'memory-card--matched' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={card.key}
                  type="button"
                  className={cardClass}
                  aria-label={isFlipped || isMatched ? card.label : 'Hidden card'}
                  onClick={() => handleFlip(index)}
                >
                  <span className="memory-card__inner">
                    <span className="memory-card__face memory-card__face--back">
                      <Layers size={24} aria-hidden="true" />
                    </span>
                    <span className="memory-card__face memory-card__face--front">
                      <Icon size={26} aria-hidden="true" />
                      <small>{card.label}</small>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
      {phase === 'result' && (
        <div className="memory-game__summary">
          You matched {score} pairs in {moves} moves with {timeLeft}s left.
        </div>
      )}
    </GameShell>
  )
}

export default MemoryMatchGame
