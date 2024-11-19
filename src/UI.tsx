import { useBoundStore } from './store';

export const UI: React.FC = () => {
  const { startGame, pauseGame, unpauseGame, gameState, gameTimer } = useBoundStore();

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
          {gameState === 'paused' ? (
            <button id="pauseButton" onClick={() => unpauseGame()}>
              PLAY
            </button>
          ) : (
            <button id="pauseButton" onClick={() => pauseGame()}>
              PAUSE
            </button>
          )}
          {`${gameTimer} seconds left`}
          <div></div>
        </div>
      )}
    </div>
  );
};
