import { Physics } from '@react-three/rapier';
import { Canvas } from '@react-three/fiber';
import { GameStateProvider, useGameState } from './GameState';
import { CAMERA_Z_OFFSET, MENU_Z_INDEX } from './data/constants';
import { Scene } from './Scene';
import { UI } from './UI';

const App: React.FC = () => {
  const { gameState } = useGameState();
  return (
    <GameStateProvider>
      <>
        <UI />
        <Canvas
          camera={{
            fov: 75,
            position: [0, 0, MENU_Z_INDEX + CAMERA_Z_OFFSET],
          }}
        >
          <Scene />
        </Canvas>
      </>
    </GameStateProvider>
  );
};

export default App;
