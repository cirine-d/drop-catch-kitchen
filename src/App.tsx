import { Physics } from '@react-three/rapier';
import { Canvas } from '@react-three/fiber';
import { GameState as GameStateContainer } from './GameState';
import { CAMERA_Z_OFFSET, MENU_Z_INDEX } from './data/constants';
import { Scene } from './Scene';
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
              <Physics debug paused={gameState === 'paused' || gameState === 'gameOver'}>
                <Scene
                  gameState={gameState}
                  currentLevel={currentLevel}
                  updateIngredientsCaught={updateIngredientsCaught}
                />
              </Physics>
            </Canvas>
          </>
        )}
      </GameStateContainer>
    </>
  );
};

export default App;
