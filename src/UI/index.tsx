import { levels } from './data/constants';
import { useBoundStore } from './store';
import { isLevelName } from './utils';

export const UI: React.FC = () => {
  const { startLevel, pauseGame, unpauseGame, goToLevelPicker, gameState, gameTimer } = useBoundStore();

  return (
    <div id="ui">
      {gameState === 'startMenu' && (
        <div id="startMenu">
          DROP CATCH KITCHEN!
          <button id="playButton" onClick={goToLevelPicker}>
            PLAY
          </button>
        </div>
      )}
      {gameState === 'levelPicker' && (
        <div id="startMenu">
          DROP CATCH KITCHEN!
          {Object.keys(levels).map(levelName => (
            <button id={`level-${levelName}`} onClick={() => isLevelName(levelName) && startLevel(levelName)}>
              {levelName}
            </button>
          ))}
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
