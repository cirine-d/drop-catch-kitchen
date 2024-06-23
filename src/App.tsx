import { Canvas } from '@react-three/fiber';
import { GameStateProvider, useGameState } from './GameState/GameState';
import { CAMERA_Z_OFFSET, MENU_Z_INDEX } from './data/constants';
import { Scene } from './Scene';
import { UI } from './UI';
import { Physics } from '@react-three/rapier';

const App: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <>
      <UI />
      <Canvas
        camera={{
          fov: 75,
          position: [0, 0, MENU_Z_INDEX + CAMERA_Z_OFFSET],
        }}
      >
        <Physics debug paused={gameState !== 'playing'}>
          <Scene />
        </Physics>
      </Canvas>
    </>
  );
};

export default App;
