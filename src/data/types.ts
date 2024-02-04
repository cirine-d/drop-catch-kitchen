import { ingredientsDictionary, levels } from './constants';

export type HashMap<T> = { [key: string]: T };

export type BasketDirection = 'left' | 'right';

export type MenuAction = 'start' | 'pause';

export type GameState = 'startMenu' | 'startingGame' | 'playing' | 'paused' | 'gameOver';

export type IngredientName = keyof typeof ingredientsDictionary;

export type levelName = keyof typeof levels;

export interface Ingredient {
  name: string;
  color: string;
}

export interface Level {
  recipe: HashMap<number>;
  inventory: HashMap<number>;
  timer: number;
}

export interface GameBoundary {
  x: {
    min: number;
    max: number;
  };
  y: {
    min: number;
    max: number;
  };
}
