import { useMemo, useState } from 'react'
import { Award, ChevronRight, Flame, Gamepad2, Search, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import TextField from '../components/common/TextField'
import { GAME_CATEGORIES, games, getGameById } from '../data/games/gameCatalog'
import { getGameProgress, getRecentlyPlayed } from '../services/gameProgress'
import './GamesPage.css'

function GamesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const progress = getGameProgress()
  const recent = getRecentlyPlayed(3)
  const bestScore = Object.values(progress.highScores).reduce(
    (max, value) => Math.max(max, Number(value) || 0),
    0,
  )
  const filteredGames = useMemo(() => {
    const term = query.trim().toLowerCase()
    return games.filter((game) => {
      const matchesCategory = category === 'All' || game.category === category
      const matchesTerm =
        !term ||
        `${game.title} ${game.description} ${game.category} ${game.difficulty}`
          .toLowerCase()
          .includes(term)
      return matchesCategory && matchesTerm
    })
  }, [category, query])

  return (
    <div className="games-page">
      <header className="games-hero">
        <div className="games-hero__copy">
          <span className="games-hero__kicker">Play · Learn · Earn</span>
          <h1>Educational games</h1>
          <p>
            Eight focused games to sharpen your math, language, science, and reasoning skills.
          </p>
        </div>
        <span className="games-hero__level">
          <Sparkles size={14} aria-hidden="true" />
          Level {progress.levelInfo.level}
        </span>
      </header>

      <section className="games-stats" aria-label="Your game progress">
        <div className="games-stat">
          <Gamepad2 size={17} aria-hidden="true" />
          <span>Played</span>
          <strong>{progress.totalGamesPlayed}</strong>
        </div>
        <div className="games-stat">
          <Trophy size={17} aria-hidden="true" />
          <span>Best score</span>
          <strong>{bestScore}</strong>
        </div>
        <div className="games-stat">
          <Target size={17} aria-hidden="true" />
          <span>Completed</span>
          <strong>{progress.gamesCompleted}</strong>
        </div>
        <div className="games-stat">
          <Flame size={17} aria-hidden="true" />
          <span>Streak</span>
          <strong>{progress.streak} days</strong>
        </div>
        <div className="games-stat games-stat--wide">
          <Sparkles size={17} aria-hidden="true" />
          <span>Level {progress.levelInfo.level} · {progress.xp} XP</span>
          <strong>
            {progress.levelInfo.currentXp}/{progress.levelInfo.nextLevelXp} to next level
          </strong>
          <div className="games-stat__track">
            <span style={{ width: `${progress.levelInfo.percent}%` }} />
          </div>
        </div>
      </section>

      <section className="games-daily" aria-labelledby="games-daily-title">
        <div className="games-daily__icon" aria-hidden="true">
          <Zap size={24} />
        </div>
        <div className="games-daily__copy">
          <span>Daily challenge</span>
          <h2 id="games-daily-title">Algebra Sprint</h2>
          <p>Ten quick questions, one 60-second clock, and a fresh streak every day.</p>
        </div>
        <Button type="button" onClick={() => navigate('/games/math-challenge?daily=1')}>
          Start now
        </Button>
      </section>

      <section className="games-library" aria-labelledby="games-library-title">
        <div className="games-section-heading">
          <div>
            <span>Choose a game</span>
            <h2 id="games-library-title">Game library</h2>
          </div>
          <TextField
            id="games-search"
            className="games-search"
            icon={Search}
            label="Search games"
            placeholder="Search games"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="games-filters" aria-label="Filter games by category">
          {GAME_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? 'games-filter games-filter--active' : 'games-filter'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredGames.length === 0 ? (
          <div className="games-empty">No games match that search. Try another term or category.</div>
        ) : (
          <div className="games-grid">
            {filteredGames.map((game) => {
              const Icon = game.icon
              const highScore = progress.highScores[game.id] || 0
              return (
                <button
                  key={game.id}
                  type="button"
                  className={`games-card games-card--${game.tone}`}
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  <span className="games-card__top">
                    <span className="games-card__icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <span className="games-card__xp">×{game.xpMultiplier} XP</span>
                  </span>
                  <strong>{game.title}</strong>
                  <span className="games-card__description">{game.description}</span>
                  <span className="games-card__meta">
                    <span>{game.category}</span>
                    <span>{game.difficulty}</span>
                  </span>
                  <span className="games-card__footer">
                    <span>Best {highScore}</span>
                    <ChevronRight size={17} aria-hidden="true" />
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="games-recent" aria-labelledby="games-recent-title">
        <div className="games-section-heading">
          <div>
            <span>Jump back in</span>
            <h2 id="games-recent-title">Recently played</h2>
          </div>
        </div>
        {recent.length === 0 ? (
          <div className="games-empty">Play a game and your recent sessions will appear here.</div>
        ) : (
          <div className="games-recent__list">
            {recent.map((entry) => {
              const game = getGameById(entry.gameId)
              if (!game) return null
              const Icon = game.icon
              return (
                <button
                  key={entry.gameId}
                  type="button"
                  className="games-recent__item"
                  onClick={() => navigate(`/games/${entry.gameId}`)}
                >
                  <span className="games-recent__icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <span className="games-recent__copy">
                    <strong>{entry.title || game.title}</strong>
                    <small>
                      {entry.score}/{entry.total} · {entry.completed ? 'Completed' : 'Timed out'}
                    </small>
                  </span>
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="games-achievements" aria-labelledby="games-achievements-title">
        <div className="games-section-heading">
          <div>
            <span>Keep the momentum</span>
            <h2 id="games-achievements-title">Achievements</h2>
          </div>
          <span className="games-achievements__count">
            {progress.badges.length}/{progress.achievements.length} unlocked
          </span>
        </div>
        <div className="games-achievements__grid">
          {progress.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={
                achievement.unlocked
                  ? 'games-achievement games-achievement--unlocked'
                  : 'games-achievement'
              }
            >
              <Award size={20} aria-hidden="true" />
              <strong>{achievement.title}</strong>
              <p>{achievement.description}</p>
              <span>{achievement.unlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GamesPage
