import { Canvas } from '@react-three/fiber';
import { CAMERA_Z_OFFSET, LEVEL_Z_INDEX, MENU_Z_INDEX } from './data/constants';
import { Scene } from './Scene';
import { UI } from './UI';
import { Physics } from '@react-three/rapier';
import { Suspense, useMemo } from 'react';
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei';
import { PlayerControls } from './data/types';
import { useBoundStore } from './store';

const App: React.FC = () => {
  const { gameState } = useBoundStore();

  const keyboardControl = useMemo<KeyboardControlsEntry<PlayerControls>[]>(
    () => [
      { name: 'up', keys: ['ArrowUp', 'KeyW'] },
      { name: 'down', keys: ['ArrowDown', 'KeyS'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    ],
    []
  );

  return (
    <KeyboardControls map={keyboardControl}>
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
    </KeyboardControls>
  );
};

export default App;
