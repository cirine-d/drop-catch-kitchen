import { IngredientName, OrderName } from './types';

//No typings for these as we are building types from these constants
export const colours = {
  PINK: '#f6a5c0',
  YELLOW: '#ffc107',
  GREEN: '#4caf50',
  RED: '#f44336',
  BROWN: '#795548',
  GREIGE: '#e3e4d6',
};

export const ingredientsDictionary = {
  strawberry: {
    color: colours.RED,
    picture: 'assets/ingredients/strawberry.png',
  },
  banana: {
    color: colours.YELLOW,
    picture: 'assets/ingredients/banana.png',
  },
  apple: {
    color: colours.GREEN,
    picture: 'assets/ingredients/apple.png',
  },
  milk: {
    color: colours.GREIGE,
    picture: 'assets/ingredients/milk.png',
  },
};

export const ordersDictionary = {
  bananaSmoothie: {
    price: 5,
    recipe: {
      banana: 2,
      milk: 1,
    },
  },
  strawberryJuice: {
    price: 4,
    recipe: {
      strawberry: 2,
      apple: 1,
    },
  },
};

export const levels = {
  level_1: {
    profitGoal: 100,
    menu: new Map<OrderName, number>([
      ['bananaSmoothie', 0.8],
      ['strawberryJuice', 0.4],
    ]),
    inventory: new Map<IngredientName, number>([
      ['banana', 0.1],
      ['apple', 0.1],
      ['strawberry', 0.1],
      ['milk', 0.9],
    ]),
    timer: 20,
  },
};

export const MENU_Z_INDEX = 8;
export const LEVEL_Z_INDEX = 0;
export const SCALE_DIVIDER = 150;
export const CAMERA_Z_OFFSET = 5;

export const GAME_PANEL = 'GamePanel';
export const MENU_PANEL = 'MenuPanel';

//InteractionGroups
export const BASKET_BOUNDS = 0;
export const BASKET_SENSOR = 1;
export const INGREDIENTS = 2;
