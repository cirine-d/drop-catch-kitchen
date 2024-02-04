import { GameState as GameStateContainer } from './GameState';
import { Scene } from './Scene';
import { Canvas } from '@react-three/fiber';
import { CAMERA_Z_OFFSET, LEVEL_Z_INDEX, MENU_Z_INDEX, levels } from './data/constants';
import { GameState, Level, levelName } from './data/types';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';

interface UIProps {
  startGame: (level: levelName) => void;
  pauseGame: () => void;
  gameState: GameState;
}

const UI: React.FC<UIProps> = props => (
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
        <div></div>
      </div>
    )}
  </div>
);

const App: React.FC = () => {
  //   window.onload = () => {
  //     window.addEventListener('resize', scene.resizeScene, false);
  //     document.addEventListener('keydown', event => scene.moveBasket(getDirectionFromKey(event)), false);
  //     window.addEventListener;
  //   };

  // const startCameraPosition = [0, 0, MENU_Z_INDEX + CAMERA_Z_OFFSET];
  // const levelCameraPosition = [0, 0, LEVEL_Z_INDEX + CAMERA_Z_OFFSET];

  return (
    <>
      <GameStateContainer>
        {({ currentLevel, pauseGame, startGame, gameState }) => (
          <>
            <UI startGame={startGame} pauseGame={pauseGame} gameState={gameState} />
            <Canvas
              camera={{
                fov: 75,
                position: [0, 0, MENU_Z_INDEX + CAMERA_Z_OFFSET],
              }}
            >
              <Suspense>
                <Physics>
                  <Scene gameState={gameState} currentLevel={currentLevel} />
                </Physics>
              </Suspense>
            </Canvas>
          </>
        )}
      </GameStateContainer>
    </>
  );
};

export default App;
