import { appliancesDictionary, ingredientsDictionary, levels, ordersDictionary } from './constants';

export type BasketDirection = 'left' | 'right' | null;

export type MenuAction = 'start' | 'pause';

export type GameState = 'startMenu' | 'startingGame' | 'playing' | 'paused' | 'gameOver';

export type IngredientName = keyof typeof ingredientsDictionary;

export type ApplianceName = keyof typeof appliancesDictionary;

export type OrderName = keyof typeof ordersDictionary;

export type LevelName = keyof typeof levels;

//TODO - Write some unit test for constants to make them typesafe?

// export interface Ingredient {
//   color: string;
//   picture: string;
// }

// export interface Appliance {
//   picture: string;
// }

// export interface Order {
//   price: number;
//   recipe: Partial<Record<IngredientName, number>>;
//   appliance: ApplianceName;
// }

export interface Level {
  menu: Map<OrderName, number>;
  profitGoal: number;
  timer: number; //minutes
  isStorageEnabled: boolean;
}

export interface Appliance {
  acceptedIngredients: IngredientName[];
  content: Partial<Record<IngredientName, number>>;
  isCooking: boolean;
  cookingTime: number; //minutes
  updateContent?: (ingredients: IngredientName[]) => void;
  setIsCooking?: (isCooking: boolean) => void;
}
