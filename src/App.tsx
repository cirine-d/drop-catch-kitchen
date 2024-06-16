import { GameState as GameStateContainer } from './GameState';
import { Scene } from './Scene';
import { Canvas } from '@react-three/fiber';
import { CAMERA_Z_OFFSET, MENU_Z_INDEX } from './data/constants';
// import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import { UI } from './UI';

const App: React.FC = () => {
  return (
    <>
      <GameStateContainer>
        {({ currentLevel, pauseGame, startGame, gameState, updateIngredientsCaught, timer }) => (
          <>
            <UI startGame={startGame} pauseGame={pauseGame} gameState={gameState} timer={timer} />
            <Canvas
              camera={{
                fov: 75,
                position: [0, 0, MENU_Z_INDEX + CAMERA_Z_OFFSET],
              }}
            >
              {/* <Suspense> */}
              <Physics debug paused={gameState === 'paused' || gameState === 'gameOver'}>
                <Scene
                  gameState={gameState}
                  currentLevel={currentLevel}
                  updateIngredientsCaught={updateIngredientsCaught}
                />
              </Physics>
              {/* </Suspense> */}
            </Canvas>
          </>
        )}
      </GameStateContainer>
    </>
  );
};

export default App;
