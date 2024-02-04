import { useState } from 'react';
import { levels } from './data/constants';
import { GameState as State, levelName, Level, IngredientName, HashMap } from './data/types';

interface Props {
  children: (props: IGameState) => React.ReactElement | null;
}

export interface IGameState {
  startGame: (level: levelName) => void;
  pauseGame: () => void;
  gameState: State;
  currentLevel: Level;
}

export const GameState: React.FC<Props> = ({ children }) => {
  const [gameState, setGameState] = useState<State>('startMenu');
  const [ingredientsCaught, setIngredientsCaught] = useState<HashMap<number>>({ strawberry: 0 });
  const [currentLevel, setCurrentLevel] = useState<Level>();
  //   const [timer, setTimer] = useState<number>(currentLevel.timer);

  const startGame = (levelName: levelName) => {
    setGameState('startingGame');
    setCurrentLevel(levels[levelName]);
    const interval = setInterval(() => {
      setGameState('playing');
      return clearInterval(interval);
    }, 500);
    checkForLevelCompletion();
    // const groceryList = currentLevel.groceryList;
  };

  const pauseGame = () => {
    if (gameState !== 'paused') {
      setGameState('paused');
    } else {
      setGameState('playing');
    }
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  const checkForLevelCompletion = () => {
    console.log(currentLevel);
  };

  const updateRecipeProgress = (ingredient: IngredientName) => {};
  return children({
    startGame,
    pauseGame,
    gameState,
    currentLevel,
  });
};
