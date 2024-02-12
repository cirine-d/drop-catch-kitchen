import { useState } from 'react';
import { levels } from './data/constants';
import { GameState as State, Level, IngredientName, LevelName } from './data/types';

interface Props {
  children: (props: IGameState) => React.ReactElement | null;
}

export interface IGameState {
  gameState: State;
  currentLevel: Level;
  startGame: (level: LevelName) => void;
  pauseGame: () => void;
  updateIngredientsCaught: (ingredient: IngredientName) => void;
}

export const GameState: React.FC<Props> = ({ children }) => {
  const [gameState, setGameState] = useState<State>('startMenu');
  const [ingredientsCaught, setIngredientsCaught] = useState<Partial<Record<IngredientName, number>>>({});
  const [currentLevel, setCurrentLevel] = useState<Level>();
  //   const [timer, setTimer] = useState<number>(currentLevel.timer);

  const startGame = (levelName: LevelName) => {
    setGameState('startingGame');
    setCurrentLevel(levels[levelName]);
    const interval = setInterval(() => {
      setGameState('playing');
      return clearInterval(interval);
    }, 500);
    checkForLevelProgress();
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

  const checkForLevelProgress = () => {
    // console.log(currentLevel);
  };

  const updateIngredientsCaught = (ingredient: IngredientName) => {
    const updated = {
      ...ingredientsCaught,
      [ingredient]: ingredientsCaught[ingredient] ? ++ingredientsCaught[ingredient] : 1,
    };

    setIngredientsCaught(updated);
  };
  console.log(ingredientsCaught);

  return children({
    startGame,
    pauseGame,
    gameState,
    currentLevel,
    updateIngredientsCaught,
  });
};
