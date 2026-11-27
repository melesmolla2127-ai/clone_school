import { ArrowLeft, Award, Play, RotateCcw, Sparkles, Target, Trophy } from 'lucide-react'
import Button from '../common/Button'
import { getGameHighScore } from '../../services/gameProgress'
import './GameShell.css'

function GameShell({
  game,
  phase,
  onStart,
  onRestart,
  onExit,
  score = 0,
  total = 0,
  reward,
  children,
  isDaily = false,
}) {
  const Icon = game.icon
  const bestScore = getGameHighScore(game.id)
  const percent = total > 0 ? Math.min(100, Math.round((score / total) * 100)) : 0
  const newBadges = reward?.newBadges || []
  const xpEarned = reward?.xpEarned || 0
  const resultTitle = percent >= 100 ? 'Perfect run!' : percent >= 80 ? 'Well played!' : 'Nice effort!'
  const shellClass = [
    'game-shell',
    `game-shell--${game.id}`,
    `game-shell--${phase}`,
    `game-shell--${game.tone}`,
    isDaily ? 'game-shell--daily' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={shellClass} aria-label={game.title}>
      {phase === 'intro' && (
        <div className="game-shell__intro">
          {isDaily && (
            <span className="game-shell__daily-badge">
              <Sparkles size={14} aria-hidden="true" />
              Daily challenge
            </span>
          )}
          <div className="game-shell__hero-icon" aria-hidden="true">
            <Icon size={36} strokeWidth={2} />
          </div>
          <span className="game-shell__kicker">Educational game</span>
          <h1>{game.title}</h1>
          <p className="game-shell__description">{game.description}</p>
          <ul className="game-shell__instructions">
            {game.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
          {children}
          <div className="game-shell__best">
            <Trophy size={15} aria-hidden="true" />
            Best score: <strong>{bestScore}</strong>
          </div>
          <Button type="button" icon={Play} onClick={onStart}>
            Start game
          </Button>
        </div>
      )}

      {phase === 'play' && (
        <div className="game-shell__play">
          <header className="game-shell__play-header">
            <button type="button" className="game-shell__exit" onClick={onExit}>
              <ArrowLeft size={17} aria-hidden="true" />
              Exit
            </button>
            <span className="game-shell__score-chip">
              <Target size={15} aria-hidden="true" />
              {score}/{total || '—'}
            </span>
          </header>
          {total > 0 && (
            <div className="game-shell__progress" aria-label="Game progress">
              <span style={{ width: `${percent}%` }} />
            </div>
          )}
          {isDaily && <span className="game-shell__play-daily">Daily challenge</span>}
          <div className="game-shell__play-body">{children}</div>
        </div>
      )}

      {phase === 'result' && (
        <div className="game-shell__result">
          <div className="game-shell__result-icon" aria-hidden="true">
            <Trophy size={32} strokeWidth={2} />
          </div>
          <span className="game-shell__kicker">Game complete</span>
          <h1>{resultTitle}</h1>
          <p className="game-shell__result-score">
            You scored <strong>{score}</strong> out of <strong>{total}</strong>
          </p>
          <div className="game-shell__result-stats">
            <span>
              <Sparkles size={15} aria-hidden="true" />
              +{xpEarned} XP
            </span>
            <span>
              <Trophy size={15} aria-hidden="true" />
              Best {bestScore}
            </span>
          </div>
          {children}
          {newBadges.length > 0 && (
            <div className="game-shell__badges" aria-live="polite">
              <h2>
                <Award size={17} aria-hidden="true" />
                New badges
              </h2>
              <div className="game-shell__badge-list">
                {newBadges.map((badge) => (
                  <span key={badge.id}>
                    <strong>{badge.title}</strong>
                    <small>{badge.description}</small>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="game-shell__result-actions">
            <Button type="button" icon={RotateCcw} onClick={onRestart}>
              Play again
            </Button>
            <Button type="button" variant="secondary" icon={ArrowLeft} onClick={onExit}>
              Exit to Games
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default GameShell
