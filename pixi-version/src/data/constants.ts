import { OrderName } from './types';

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

export const appliancesDictionary = {
  blender: {
    picture: 'assets/appliances/blender.png',
    contentLimit: 3,
    specialBehaviour: [],
  },
  largeBlender: {
    picture: 'assets/appliances/blender.png',
    contentLimit: 4,
    specialBehaviour: [],
  },
  storage: {
    picture: 'assets/appliances/storage.png',
    contentLimit: 1,
    specialBehaviour: ['acceptAllIngredients', 'cookingDisabled', 'canOutputIngredients'],
  },
};

//How to insure unique ingredient/appliance combos for each order? Could cause issues with cooking logic if not unique
export const ordersDictionary = {
  bananaSmoothie: {
    name: 'bananaSmoothie',
    price: 5,
    appliance: 'blender',
    cookingTime: 4,
    recipe: {
      banana: 2,
      milk: 1,
    },
    picture: 'assets/orders/bananaSmoothie.png',
  },
  strawberryJuice: {
    name: 'strawberryJuice',
    price: 4,
    appliance: 'blender',
    cookingTime: 4,
    recipe: {
      strawberry: 2,
      apple: 1,
    },
    picture: 'assets/orders/strawberryJuice.png',
  },
  failedOrder: {
    name: 'failedOrder',
    cookingTime: 4,
    picture: 'assets/orders/poop.png',
    price: 1,
  },
};

export const levels = {
  level_1: {
    profitGoal: 100,
    menu: new Map<OrderName, number>([
      ['bananaSmoothie', 0.8],
      ['strawberryJuice', 0.4],
    ]),
    timer: 20,
    extraAppliances: ['storage', 'storage'],
  },
  level_2: {
    profitGoal: 100,
    menu: new Map<OrderName, number>([
      ['bananaSmoothie', 0.8],
      ['strawberryJuice', 0.4],
    ]),
    timer: 20,
    extraAppliances: ['storage'],
  },
};

export const SCALE_DIVIDER = 150;

export const GAME_PANEL = 'GamePanel';
export const MENU_PANEL = 'MenuPanel';

//InteractionGroups
export const BASKET_BOUNDS = 0;
export const BASKET_SENSOR = 1;
export const INGREDIENTS = 2;
export const APPLIANCES = 3;
export const BASKET_LID = 4;
