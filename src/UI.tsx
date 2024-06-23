import { useGameState } from './GameState';

export const UI: React.FC = () => {
  const { startGame, pauseGame, gameState, timer } = useGameState();
  return (
    <div id="ui">
      {gameState === 'startMenu' && (
        <div id="startMenu">
          DROP CATCH KITCHEN!
          <button id="playButton" onClick={() => startGame('level_1')}>
            PLAY
          </button>
        </div>
      )}
      {gameState !== 'startMenu' && (
        <div id="gameMenu">
          <button id="pauseButton" onClick={() => pauseGame()}>
            {gameState === 'paused' ? 'PLAY' : 'PAUSE'}
          </button>
          {`${timer} seconds left`}
          <div></div>
        </div>
      )}
    </div>
  );
};
