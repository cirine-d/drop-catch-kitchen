import { GameState, LevelName } from './data/types';

interface UIProps {
  startGame: (level: LevelName) => void;
  pauseGame: () => void;
  gameState: GameState;
  timer: number;
}

export const UI: React.FC<UIProps> = props => {
  return (
    <div id="ui">
      {props.gameState === 'startMenu' && (
        <div id="startMenu">
          DROP CATCH KITCHEN!
          <button id="playButton" onClick={() => props.startGame('level_1')}>
            PLAY
          </button>
        </div>
      )}
      {props.gameState !== 'startMenu' && (
        <div id="gameMenu">
          <button id="pauseButton" onClick={() => props.pauseGame()}>
            {props.gameState === 'paused' ? 'PLAY' : 'PAUSE'}
          </button>
          {`${props.timer} seconds left`}
          <div></div>
        </div>
      )}
    </div>
  );
};
