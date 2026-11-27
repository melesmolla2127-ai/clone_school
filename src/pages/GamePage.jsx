import { Compass } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import MathChallengeGame from '../components/games/games/MathChallengeGame'
import MemoryMatchGame from '../components/games/games/MemoryMatchGame'
import VocabularyChallengeGame from '../components/games/games/VocabularyChallengeGame'
import SpellingChallengeGame from '../components/games/games/SpellingChallengeGame'
import ScienceQuizGame from '../components/games/games/ScienceQuizGame'
import SpeedQuizGame from '../components/games/games/SpeedQuizGame'
import LogicChallengeGame from '../components/games/games/LogicChallengeGame'
import NumberChallengeGame from '../components/games/games/NumberChallengeGame'
import { getGameById } from '../data/games/gameCatalog'
import './GamePage.css'

const gameComponents = {
  'math-challenge': MathChallengeGame,
  'memory-match': MemoryMatchGame,
  'vocabulary-challenge': VocabularyChallengeGame,
  'spelling-challenge': SpellingChallengeGame,
  'science-quiz': ScienceQuizGame,
  'speed-quiz': SpeedQuizGame,
  'logic-challenge': LogicChallengeGame,
  'number-challenge': NumberChallengeGame,
}

function GamePage() {
  const { gameId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const game = getGameById(gameId)
  const GameComponent = game ? gameComponents[game.id] : null
  const isDaily = searchParams.get('daily') === '1'

  if (!game || !GameComponent) {
    return (
      <div className="game-page game-page--missing">
        <div className="game-page__icon" aria-hidden="true">
          <Compass size={30} />
        </div>
        <span className="game-page__kicker">Unknown game</span>
        <h1>We could not find that game</h1>
        <p>The link may be outdated. Head back to the library and choose another game.</p>
        <Button type="button" onClick={() => navigate('/games')}>
          Back to Games
        </Button>
      </div>
    )
  }

  return (
    <div className="game-page">
      <GameComponent key={`${game.id}-${isDaily}`} isDaily={isDaily} />
    </div>
  )
}

export default GamePage
