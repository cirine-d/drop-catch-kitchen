import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { levels } from '../data/constants';
import { GameState as State, Level, IngredientName, LevelName, ApplianceName, Appliance } from '../data/types';
import { createAppliancesMap, generateWeightedInventoryFromMenu } from './utils';

interface IGameStateContext {
  gameState: State;
  currentLevel: Level | undefined;
  timer: number;
  inventory: Map<IngredientName, number> | undefined;
  appliances: Map<string, Appliance | undefined> | undefined;
  startGame: (level: LevelName) => void;
  pauseGame: () => void;
  updateBasketContent: (ingredient: IngredientName) => void;
  updateAppliances: (applianceId: string, appliance: Appliance) => void;
}

const GameStateContext = createContext<IGameStateContext | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<State>('startMenu');
  const [basketContent, setBasketContent] = useState<Partial<Record<IngredientName, number>>>({});
  const [currentLevel, setCurrentLevel] = useState<Level>();
  const [timer, setTimer] = useState<number>(0);
  const [appliances, setAppliances] = useState<IGameStateContext['appliances']>(undefined);

  const inventory = useMemo(
    () => (currentLevel !== undefined ? generateWeightedInventoryFromMenu(currentLevel.menu) : undefined),
    [currentLevel]
  );

  const updateAppliances = useCallback(
    (applianceId: string, appliance: Appliance) => {
      const updatedAppliances = appliances;
      if (appliances !== undefined) {
        updatedAppliances.set(applianceId, appliance);
      }
      setAppliances(updatedAppliances);
    },
    [appliances]
  );

  useEffect(() => {
    let interval;

    if (gameState === 'startingGame' && currentLevel) {
      setTimer(currentLevel.timer);
      setAppliances(createAppliancesMap(currentLevel.menu, currentLevel.isStorageEnabled));
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

  const updateBasketContent = useCallback((ingredient: IngredientName) => {
    setBasketContent(prev => ({
      ...prev,
      [ingredient]: (prev[ingredient] || 0) + 1,
    }));
  }, []);
  console.log(basketContent);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        currentLevel,
        timer,
        inventory,
        appliances,
        startGame,
        pauseGame,
        updateBasketContent,
        updateAppliances,
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
