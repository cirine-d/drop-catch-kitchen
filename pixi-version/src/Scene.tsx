import React from 'react';
import { FC, useEffect, useState } from 'react';
import { IngredientName } from './data/types';
import { generateItemFromWeightedList, generateRandom } from './utils';
import { Basket } from './gameObjects/Basket';
import { Ingredient } from './gameObjects/Ingredient';
import { useBoundStore } from './store';
import { useTick } from '@pixi/react';
import { useGameWindowBoundaries } from './store/utilityHooks';
import AppliancesBar from './gameObjects/Appliances/AppliancesBar';

export const Scene: FC = () => {
  const gameBoundaries = useGameWindowBoundaries();
  const { gameState, inventory, appliances, updatePhysics } = useBoundStore();
  const [fallingIngredients, setFallingIngredients] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (gameState === 'levelPicker') {
      setFallingIngredients([]);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'startingLevel') {
      // setUpGame();
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
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const addIngredientToScene = (ingredientName: IngredientName) => {
    const ingredient = generateIngredient(ingredientName, gameBoundaries);
    setFallingIngredients(prevIngredients => [...prevIngredients, ingredient]);
  };

  const generateIngredient = (name: IngredientName, gamePanelBoundaries) => {
    const randomXPos = generateRandom(gamePanelBoundaries.left, gamePanelBoundaries.right);
    const startPosition = { x: randomXPos, y: gamePanelBoundaries.top };
    return <Ingredient key={`${name}-${crypto.randomUUID()}`} name={name} startPosition={startPosition} />;
  };

  useTick(ticker => {
    if (gameState === 'playing') {
      updatePhysics(ticker.deltaTime);
    }
  });

  return (
    <>
      {fallingIngredients.map(ingredient => ingredient)}
      {(gameState === 'playing' || gameState === 'paused' || gameState === 'gameOver') && <Basket />}
      {appliances !== undefined ? <AppliancesBar appliances={appliances} /> : null}
      {/* development tools */}
      {/* development tools */}
    </>
  );
};
