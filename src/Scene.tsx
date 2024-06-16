import * as THREE from 'three';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, useBounds } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { GameState, IngredientName } from './data/types';
import { CAMERA_Z_OFFSET, GAME_PANEL, LEVEL_Z_INDEX, MENU_PANEL, MENU_Z_INDEX, colours } from './data/constants';
import { IGameState } from './GameState';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { generateItemFromWeightedList, generateRandom, shuffleArray } from './utils';
import { Basket } from './gameObjects/Basket';
import { Ingredient } from './gameObjects/Ingredient';
import { generateUUID } from 'three/src/math/MathUtils';
import { Vector3 as RVector3 } from '@dimforge/rapier3d-compat';
import { RapierRigidBody, useRapier } from '@react-three/rapier';

interface IScene extends Omit<IGameState, 'startGame' | 'pauseGame' | 'timer'> {
  // resizeScene: () => void;
  // handleMenuClick: (action: MenuAction) => void;
  // moveBasket: (direction: BasketDirection) => void;
}

export const Scene: React.FC<IScene> = props => {
  const scene = useThree();
  const physicsWorld = useRapier();
  const [levelInventory, setLevelInventory] = useState<IngredientName[]>([]);
  const [fallingIngredients, setFallingIngredients] = useState<JSX.Element[]>([]);
  const cameraPosition = useRef(scene.camera.position);
  const gamePanelBoundariesRef = useRef<any>();

  // const bounds = useBounds();

  useEffect(() => {
    if (gamePanelBoundariesRef.current === undefined) {
      gamePanelBoundariesRef.current = getGamePanelBoundaries();
    }

    if (props.gameState === 'startingGame') {
      setUpGame();
    }

    let interval = setInterval(() => {
      if (props.gameState === 'paused') {
        return;
      }

      if (props.gameState === 'gameOver') {
        return clearInterval(interval);
      }

      if (props.gameState === 'playing') {
        addIngredientToScene(generateItemFromWeightedList(props.currentLevel.inventory));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [props.gameState]);

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
    let updatedLevelInventory = levelInventory;

    for (var [key, value] of props.currentLevel.inventory.entries()) {
      // const copies = copyStringIntoTypedArray<IngredientName>(i, props.currentLevel.inventory[i]);
      // updatedLevelInventory = [...updatedLevelInventory, ...copies];
    }

    setLevelInventory(shuffleArray(updatedLevelInventory));
  };

  // const basketSize = basket.object.geometry.boundingBox?.getSize(new THREE.Vector3());

  //Functions

  // const handleMenuClick = (action: MenuAction) => {
  //   const startMenu = document.getElementById('startMenu');
  //   const pauseMenu = document.getElementById('gameMenu');
  //   if (startMenu && pauseMenu && camera.object && action === 'start') {
  //     startMenu.style.visibility = 'hidden';
  //     pauseMenu.style.visibility = 'initial';
  //     cameraPosition = levelCameraPosition;
  //     gameState.startGame('level_1');
  //   }
  //   if (startMenu && pauseMenu && camera.object && action === 'pause') {
  //     startMenu.style.visibility = 'initial';
  //     pauseMenu.style.visibility = 'hidden';
  //     cameraPosition = startCameraPosition;
  //   }
  // };

  // const animateFallingIngredients = () => {
  //   fallingIngredients.forEach(ingredient => {
  //     const fallingObject = scene.scene.getObjectByName(ingredient.props.name);
  //     if (fallingObject && fallingObject.position.y < gamePanelBoundariesRef.current.bottom) {
  //       scene.scene.remove(fallingObject);
  //     }

  //     if (fallingObject) {
  //       fallingObject.position.y -= 0.01;
  //     }
  //   });
  //   // gameState.updateBasketContent();
  //   // camera.moveCamera(cameraPosition);
  // };

  // const isIngredientInBasket = (ingredientObject: THREE.Mesh) => {
  //   var basketBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  //   var ingredientBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  //   basketBoundingBox.setFromObject(props.basket.object);
  //   ingredientBoundingBox.setFromObject(ingredientObject);
  //   return basketBoundingBox.containsBox(ingredientBoundingBox);
  // };

  // const pauseGame = () => {};

  const addIngredientToScene = (ingredientName: IngredientName) => {
    const gamePanelBoundaries = gamePanelBoundariesRef.current;
    const updatedLevelInventory = levelInventory;

    const ingredient = generateIngredient(ingredientName, gamePanelBoundaries);
    // const updatedFallingIngredients = fallingIngredients;
    // updatedFallingIngredients.push(ingredient);
    setFallingIngredients(prevIngredients => [...prevIngredients, ingredient]);
    setLevelInventory(updatedLevelInventory);
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

  // const updateBasketContent = () => {
  //   fallingIngredients.forEach(x => {
  //     if (isIngredientInBasket(x.object)) {
  //       props.basket.addIngredient(x);
  //     }
  //   });
  // };

  useFrame(state => {
    state.camera.position.lerp(cameraPosition.current, 0.05);
    // if (props.gameState === 'playing') {
    //   animateFallingIngredients();
    // }
  });

  return (
    <>
      <MenuPanel />
      <GameScenePanel />
      {fallingIngredients.map(ingredient => ingredient)}
      {props.gameState !== 'startMenu' && (
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
          updateIngredientsCaught={props.updateIngredientsCaught}
          removeIngredientFromScene={removeIngredientFromScene}
        />
      )}
      <OrbitControls />
      <axesHelper args={[1000000]} />
    </>
  );
};
