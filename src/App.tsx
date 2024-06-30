import { Canvas } from '@react-three/fiber';
import { GameStateProvider, useGameState } from './GameState/GameState';
import { CAMERA_Z_OFFSET, LEVEL_Z_INDEX, MENU_Z_INDEX } from './data/constants';
import { Scene } from './Scene';
import { UI } from './UI';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';

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
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, LEVEL_Z_INDEX]} />
        <Suspense>
          <Physics debug paused={gameState !== 'playing'} colliders={false}>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
