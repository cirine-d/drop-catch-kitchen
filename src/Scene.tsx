import * as THREE from 'three';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, useBounds } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { GameState, IngredientName } from './data/types';
import { CAMERA_Z_OFFSET, GAME_PANEL, LEVEL_Z_INDEX, MENU_Z_INDEX, colours } from './data/constants';
import { IGameState } from './GameState';
import { Ingredient } from './gameObjects/Ingredient';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { copyStringIntoTypedArray, generateRandom, shuffleArray } from './utils';
import { Basket } from './gameObjects/Basket';

interface IScene extends Omit<IGameState, 'startGame' | 'pauseGame'> {
  // resizeScene: () => void;
  // handleMenuClick: (action: MenuAction) => void;
  // moveBasket: (direction: BasketDirection) => void;
}

export const Scene: React.FC<IScene> = props => {
  const scene = useThree();
  const [levelInventory, setLevelInventory] = useState<IngredientName[]>([]);
  const [fallingIngredients, setFallingIngredients] = useState<THREE.Mesh[]>([]);
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

      if (levelInventory.length === 0) {
        return clearInterval(interval);
      }

      if (props.gameState === 'playing') {
        addIngredientToScene();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [props.gameState]);

  const MenuPanel = () => {
    const menuTexture = useLoader(TextureLoader, 'assets/startMenuPicture.jpg');
    return (
      <mesh position={[0, 0, MENU_Z_INDEX]}>
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
    const gamePanelBoundaries = gamePanelBoundariesRef.current;

    const basketMesh = Basket({
      startPosition: new THREE.Vector3(gamePanelBoundaries.right, gamePanelBoundaries.bottom + 0.5, LEVEL_Z_INDEX),
      gamePanelBoundaries: {
        left: gamePanelBoundaries.left,
        right: gamePanelBoundaries.right,
      },
    });

    scene.scene.add(basketMesh);

    cameraPosition.current = new THREE.Vector3(0, 0, LEVEL_Z_INDEX + CAMERA_Z_OFFSET);
    let updatedLevelInventory = levelInventory;
    for (var i in props.currentLevel.inventory) {
      const copies = copyStringIntoTypedArray<IngredientName>(i, props.currentLevel.inventory[i]);
      updatedLevelInventory = [...updatedLevelInventory, ...copies];
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

  const animateFallingIngredients = () => {
    fallingIngredients.forEach(ingredient => {
      const fallingObject = scene.scene.getObjectById(ingredient.id);
      if (fallingObject && fallingObject.position.y < gamePanelBoundariesRef.current.bottom) {
        scene.scene.remove(fallingObject);
      }

      if (fallingObject) {
        fallingObject.position.y -= 0.01;
      }
    });
    // gameState.updateBasketContent();
    // camera.moveCamera(cameraPosition);
  };

  const isIngredientInBasket = (ingredientObject: THREE.Mesh) => {
    var basketBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    var ingredientBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    basketBoundingBox.setFromObject(props.basket.object);
    ingredientBoundingBox.setFromObject(ingredientObject);
    return basketBoundingBox.containsBox(ingredientBoundingBox);
  };

  // const pauseGame = () => {};

  const addIngredientToScene = () => {
    const gamePanelBoundaries = gamePanelBoundariesRef.current;
    const updatedLevelInventory = levelInventory;

    const ingredient = spawnIngredient(updatedLevelInventory.pop(), gamePanelBoundaries);
    const x = fallingIngredients;
    x.push(ingredient);
    setFallingIngredients(x);
    scene.scene.add(ingredient);
    setLevelInventory(updatedLevelInventory);
  };

  const spawnIngredient = (name: IngredientName, gamePanelBoundaries) => {
    const randomXPos = generateRandom(gamePanelBoundaries.left, gamePanelBoundaries.right);
    const startPosition = new THREE.Vector3(randomXPos, gamePanelBoundaries.top, LEVEL_Z_INDEX);
    return Ingredient({ name, startPosition });
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
    if (props.gameState === 'playing') {
      animateFallingIngredients();
    }
  });

  return (
    <>
      <MenuPanel />
      <GameScenePanel />
      <OrbitControls />
      <axesHelper args={[1000000]} />
    </>
  );
};
