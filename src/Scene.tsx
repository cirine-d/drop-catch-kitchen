import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { generateUUID } from 'three/src/math/MathUtils';
import { useRapier } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { Vector3 as RVector3 } from '@dimforge/rapier3d-compat';
import { IngredientName } from './data/types';
import { CAMERA_Z_OFFSET, GAME_PANEL, LEVEL_Z_INDEX, MENU_PANEL, MENU_Z_INDEX, colours } from './data/constants';
import { generateItemFromWeightedList, generateRandom } from './utils';
import { Basket } from './gameObjects/Basket';
import { Ingredient } from './gameObjects/Ingredient';
import { useGameState } from './GameState/GameState';

export const Scene: React.FC = () => {
  const scene = useThree();
  const physicsWorld = useRapier();
  const { gameState, inventory } = useGameState();
  const [fallingIngredients, setFallingIngredients] = useState<JSX.Element[]>([]);
  const cameraPosition = useRef(scene.camera.position);
  const gamePanelBoundariesRef = useRef<any>();

  useEffect(() => {
    if (gamePanelBoundariesRef.current === undefined) {
      gamePanelBoundariesRef.current = getGamePanelBoundaries();
    }

    if (gameState === 'startingGame') {
      setUpGame();
    }

    let interval = setInterval(() => {
      if (gameState === 'paused') {
        return;
      }

      if (gameState === 'gameOver') {
        return clearInterval(interval);
      }

      if (gameState === 'playing') {
        addIngredientToScene(generateItemFromWeightedList(inventory));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [gameState]);

  const MenuPanel = () => {
    const menuTexture = useLoader(TextureLoader, 'assets/startMenuPicture.jpg');
    return (
      <mesh name={MENU_PANEL} position={[0, 0, MENU_Z_INDEX]}>
        <planeGeometry args={[scene.viewport.width / 3, scene.viewport.height / 3]} />
        <meshBasicMaterial map={menuTexture} />
      </mesh>
    );
  };

  const GameScenePanel = () => (
    <mesh position={[0, 0, LEVEL_Z_INDEX - 1]} name={GAME_PANEL}>
      <planeGeometry args={[scene.viewport.width / 3, scene.viewport.height / 3]} />
      <meshBasicMaterial color={colours.PINK} />
    </mesh>
  );

  const getGamePanelBoundaries = () => {
    const gamePanelBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()).setFromObject(
      scene.scene.getObjectByName(GAME_PANEL)
    );
    return {
      left: gamePanelBoundingBox.min.x,
      right: gamePanelBoundingBox.max.x,
      top: gamePanelBoundingBox.max.y,
      bottom: gamePanelBoundingBox.min.y,
    };
  };

  const setUpGame = () => {
    cameraPosition.current = new THREE.Vector3(0, 0, LEVEL_Z_INDEX + CAMERA_Z_OFFSET);
  };

  const addIngredientToScene = (ingredientName: IngredientName) => {
    const gamePanelBoundaries = gamePanelBoundariesRef.current;

    const ingredient = generateIngredient(ingredientName, gamePanelBoundaries);
    setFallingIngredients(prevIngredients => [...prevIngredients, ingredient]);
  };

  const generateIngredient = (name: IngredientName, gamePanelBoundaries) => {
    const randomXPos = generateRandom(gamePanelBoundaries.left, gamePanelBoundaries.right);
    const startPosition = new THREE.Vector3(randomXPos, gamePanelBoundaries.top, LEVEL_Z_INDEX);
    return <Ingredient key={`${name}-${generateUUID()}`} name={name} startPosition={startPosition} />;
  };

  const removeIngredientFromScene = (ingredientId: number, ingredientHandle: number) => {
    const ingredientMesh = scene.scene.getObjectById(ingredientId);
    const ingredientBody = physicsWorld.world.getRigidBody(ingredientHandle);
    scene.scene.remove(ingredientMesh);
    physicsWorld.world.removeRigidBody(ingredientBody);
  };

  useFrame(state => {
    state.camera.position.lerp(cameraPosition.current, 0.05);
  });

  return (
    <>
      <MenuPanel />
      <GameScenePanel />
      {fallingIngredients.map(ingredient => ingredient)}
      {gameState !== 'startMenu' && (
        <Basket
          startPosition={
            new RVector3(
              gamePanelBoundariesRef.current.right,
              gamePanelBoundariesRef.current.bottom + 0.5,
              LEVEL_Z_INDEX
            )
          }
          gamePanelBoundaries={{
            left: gamePanelBoundariesRef.current.left,
            right: gamePanelBoundariesRef.current.right,
          }}
          removeIngredientFromScene={removeIngredientFromScene}
        />
      )}
      {/* development tools */}
      <OrbitControls />
      <axesHelper args={[1000000]} />
      {/* development tools */}
    </>
  );
};
