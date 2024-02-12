import { ingredientsDictionary, levels, ordersDictionary } from './constants';

export type BasketDirection = 'left' | 'right' | null;

export type MenuAction = 'start' | 'pause';

export type GameState = 'startMenu' | 'startingGame' | 'playing' | 'paused' | 'gameOver';

export type IngredientName = keyof typeof ingredientsDictionary;

export type OrderName = keyof typeof ordersDictionary;

export type LevelName = keyof typeof levels;

export interface Ingredient {
  color: string;
}

export interface Order {
  price: number;
  recipe: Partial<Record<IngredientName, number>>;
}

export interface Level {
  menu: Map<OrderName, number>;
  inventory: Map<IngredientName, number>;
  profitGoal: number;
  timer: number; //minutes
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
