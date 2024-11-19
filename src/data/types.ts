import { appliancesDictionary, ingredientsDictionary, levels, ordersDictionary } from './constants';

export type PlayerControls = 'left' | 'right' | 'up' | 'down' | null;

export type MenuAction = 'start' | 'pause';

export type ContentUpdateMode = 'adding' | 'overwrite';

export type GameStatus = 'startMenu' | 'startingGame' | 'playing' | 'paused' | 'gameOver';

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

export interface Order {
  name: OrderName;
  price: number;
  recipe?: Partial<Record<IngredientName, number>>;
  appliance?: ApplianceName;
  cookingTime: number;
  picture: string;
}

export interface Level {
  menu: Map<OrderName, number>;
  profitGoal: number;
  timer: number; //minutes
  isStorageEnabled: boolean;
}

export interface Appliance {
  name: ApplianceName;
  acceptedIngredients: IngredientName[];
  content: IngredientName[];
  contentLimit: number;
  isActive: boolean;
  cookingTimer?: number;
  pendingOrder?: Order;
}
