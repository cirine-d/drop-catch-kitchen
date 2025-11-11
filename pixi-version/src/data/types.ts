import {
  appliancesDictionary,
  customerDictionary,
  ingredientsDictionary,
  levels,
  menuItemDictionary,
  ordersDictionary,
} from './constants';

export type BasketDirection = 'left' | 'right' | 'up' | 'down' | null;

export type MenuAction = 'start' | 'pause';

export type ContentUpdateMode = 'adding' | 'overwrite';

export const applianceBehaviours = ['acceptAllIngredients', 'cookingDisabled', 'canOutputIngredients'] as const;

export type ApplianceBehaviour = (typeof applianceBehaviours)[number];

export type OrderStatus = 'pending' | 'timedOut' | 'completed';

export type GameStatus = 'startMenu' | 'levelPicker' | 'startingLevel' | 'playing' | 'paused' | 'gameOver';

export type MenuItemCategory = 'drink' | 'sandwich' | 'doubleDrink' | 'doubleSandwich' | 'misc';

export type IngredientName = keyof typeof ingredientsDictionary;

export type ApplianceName = keyof typeof appliancesDictionary;

export type MenuItemName = keyof typeof menuItemDictionary;

export type LevelName = keyof typeof levels;

export type CustomerName = keyof typeof customerDictionary;

export type OrderName = keyof typeof ordersDictionary;

//TODO - Write some unit test for constants to make them typesafe?

// export interface Ingredient {
//   color: string;
//   picture: string;
// }

export interface Customer {
  name: string;
  picture: string;
  // patienceRating: number;
  // tippingRating: number;
  // quirks: string[];
  orderPreferrence: OrderName[];
  // hungerRating: number;
}

export interface Order {
  id: string;
  pendingItems: PendingMenuItem[];
  totalPrice: number;
  status: OrderStatus;
  timer: number;
  menuItemPictures: string[];
  customerPicture: string;
}

export interface PendingMenuItem {
  name: MenuItemName;
  fulfilled: boolean;
}

export interface MenuItem {
  name: MenuItemName;
  category: MenuItemCategory;
  price: number;
  recipe?: Partial<Record<IngredientName, number>>;
  appliance?: ApplianceName;
  cookingTime: number;
  picture: string;
}

export interface Level {
  name: LevelName;
  menu: Map<MenuItemName, number>;
  customers: Map<CustomerName, number>;
  allowedOrders: OrderName[];
  profitGoal: number;
  timer: number; //minutes
  extraAppliances: ApplianceName[];
  // featureFlags: string[];
}

export interface Appliance {
  name: ApplianceName;
  acceptedIngredients: IngredientName[];
  content: IngredientName[];
  contentLimit: number;
  isActive: boolean;
  cookingTimer?: number;
  pendingMenuItem?: MenuItem;
  specialBehaviour?: ApplianceBehaviour[];
}

export interface GameWindowBoundaries {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
