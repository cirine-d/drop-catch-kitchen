import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { levels } from '../data/constants';
import { GameState as State, Level, IngredientName, LevelName, Appliance } from '../data/types';
import { generateWeightedInventoryFromMenu, isIngredientTransferPossible } from './utils';
import { Appliances, useAppliances } from './hooks/useAppliances';
import { Basket, useBasket } from './hooks/useBasket';
import { isAcceptedIngredient, isIngredientName } from '../utils';

interface IGameStateContext extends Appliances {
  gameState: State;
  basket: Basket;
  currentLevel: Level | undefined;
  timer: number;
  inventory: Map<IngredientName, number> | undefined;
  startGame: (level: LevelName) => void;
  pauseGame: () => void;
  transferIngredientsFromBasket: () => void;
}

const GameStateContext = createContext<IGameStateContext | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<State>('startMenu');
  const [currentLevel, setCurrentLevel] = useState<Level>();
  const [timer, setTimer] = useState<number>(0);
  const basket = useBasket();
  console.log(basket.content);
  const { appliances, activeAppliance, setActiveAppliance } = useAppliances(currentLevel);

  const inventory = useMemo(
    () => (currentLevel !== undefined ? generateWeightedInventoryFromMenu(currentLevel.menu) : undefined),
    [currentLevel]
  );

  useEffect(() => {
    let interval;

    if (gameState === 'startingGame' && currentLevel) {
      setTimer(currentLevel.timer);
    }

    if (gameState === 'playing') {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer(prev => prev - 1);
        } else {
          endGame();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, timer, currentLevel]);

  const startGame = useCallback((levelName: LevelName) => {
    setGameState('startingGame');
    const level = levels[levelName];
    setCurrentLevel(level);

    setTimeout(() => {
      setGameState('playing');
    }, 500);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prevState => (prevState === 'paused' ? 'playing' : 'paused'));
  }, []);

  const endGame = useCallback(() => {
    console.log('gameOver');
    setGameState('gameOver');
  }, []);

  const transferIngredientsFromBasket = useCallback(() => {
    if (isIngredientTransferPossible(activeAppliance, basket.content)) {
      const activeApplianceCapacity = activeAppliance.contentLimit - activeAppliance.content.length;
      if (activeApplianceCapacity <= 0) {
        return;
      }

      const validIngredients = basket.content.filter(ingredient =>
        isAcceptedIngredient(activeAppliance.acceptedIngredients, ingredient)
      );

      const remainingIngredients = basket.content.filter(
        ingredient => !isAcceptedIngredient(activeAppliance.acceptedIngredients, ingredient)
      );

      remainingIngredients.concat(validIngredients.splice(activeApplianceCapacity));

      activeAppliance.updateContent('adding', validIngredients);
      basket.updateContent('overwrite', remainingIngredients);
    }
  }, [activeAppliance, basket.content, basket.updateContent]);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        basket,
        appliances,
        activeAppliance,
        setActiveAppliance,
        currentLevel,
        timer,
        inventory,
        startGame,
        pauseGame,
        transferIngredientsFromBasket,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): IGameStateContext => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
