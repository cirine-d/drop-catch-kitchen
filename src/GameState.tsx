import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { levels } from './data/constants';
import { GameState as State, Level, IngredientName, LevelName } from './data/types';

interface IGameStateContext {
  gameState: State;
  currentLevel: Level | undefined;
  timer: number;
  startGame: (level: LevelName) => void;
  pauseGame: () => void;
  updateIngredientsCaught: (ingredient: IngredientName) => void;
}

const GameStateContext = createContext<IGameStateContext | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<State>('startMenu');
  const [ingredientsCaught, setIngredientsCaught] = useState<Partial<Record<IngredientName, number>>>({});
  const [currentLevel, setCurrentLevel] = useState<Level>();
  const [timer, setTimer] = useState<number>(0);

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

  const updateIngredientsCaught = useCallback((ingredient: IngredientName) => {
    setIngredientsCaught(prev => ({
      ...prev,
      [ingredient]: (prev[ingredient] || 0) + 1,
    }));
  }, []);
  console.log(ingredientsCaught);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        currentLevel,
        timer,
        startGame,
        pauseGame,
        updateIngredientsCaught,
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
