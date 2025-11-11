import { Customer, CustomerName, Level, MenuItem, MenuItemCategory, MenuItemName, OrderName } from './types';

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
  bread: {
    color: colours.GREIGE,
    picture: 'assets/ingredients/bread.png',
  },
  cheese: {
    color: colours.YELLOW,
    picture: 'assets/ingredients/cheese.png',
  },
  lettuce: {
    color: colours.GREEN,
    picture: 'assets/ingredients/lettuce.png',
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

export const ordersDictionary = {
  drink: ['drink'],
  sandwich: ['sandwich'],
  drinkAndSandwich: ['drink', 'sandwich'],
  doubleDrink: ['drink', 'drink'],
  doubleSandwich: ['sandwich', 'sandwich'],
};

//How to insure unique ingredient/appliance combos for each order? Could cause issues with cooking logic if not unique
export const menuItemDictionary = {
  bananaSmoothie: {
    name: 'bananaSmoothie',
    category: 'drink',
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
    category: 'drink',
    price: 4,
    appliance: 'blender',
    cookingTime: 1,
    recipe: {
      strawberry: 2,
      apple: 1,
    },
    picture: 'assets/orders/strawberryJuice.png',
  },
  cheeseSandwich: {
    name: 'cheeseSandwich',
    category: 'sandwich',
    price: 4,
    appliance: 'blender',
    cookingTime: 4,
    recipe: {
      bread: 1,
      cheese: 1,
      lettuce: 1,
    },
    picture: 'assets/orders/cheeseSandwich.png',
  },
  failedOrder: {
    name: 'failedOrder',
    category: 'misc',
    cookingTime: 4,
    picture: 'assets/orders/poop.png',
    price: 1,
  },
};

export const customerDictionary = {
  frog: {
    name: 'Frog',
    picture: 'assets/customers/frog.png',
    orderPreferrence: ['drink', 'doubleDrink'] as OrderName[],
  },
  rabbit: {
    name: 'Rabbit',
    picture: 'assets/customers/rabbit.png',
    orderPreferrence: ['drink', 'sandwich', 'drinkAndSandwich'] as OrderName[], //TO DO anyway to get rid of this cast typing?
  },
};

export const levels = {
  level_1: {
    name: 'level_1',
    profitGoal: 60,
    menu: new Map<MenuItemName, number>([
      ['bananaSmoothie', 0.8],
      ['strawberryJuice', 0.4],
    ]),
    customers: new Map<CustomerName, number>([['frog', 1]]),
    allowedOrders: ['drink'],
    timer: 5,
    extraAppliances: ['storage', 'storage'],
  },
  level_2: {
    name: 'level_2',
    profitGoal: 60,
    menu: new Map<MenuItemName, number>([
      ['bananaSmoothie', 1],
      // ['strawberryJuice', 0.2],
      ['cheeseSandwich', 1],
    ]),
    customers: new Map<CustomerName, number>([
      ['frog', 0.7],
      ['rabbit', 0.3],
    ]),
    allowedOrders: ['sandwich', 'drinkAndSandwich', 'doubleDrink'],
    timer: 2,
    extraAppliances: ['blender', 'blender', 'storage'],
  },
  level_3: {
    name: 'level_2',
    profitGoal: 60,
    menu: new Map<MenuItemName, number>([
      ['bananaSmoothie', 1],
      // ['strawberryJuice', 0.2],
      ['cheeseSandwich', 1],
    ]),
    customers: new Map<CustomerName, number>([
      ['frog', 0.7],
      ['rabbit', 0.3],
    ]),
    allowedOrders: ['sandwich', 'drinkAndSandwich', 'doubleDrink'],
    timer: 2,
    extraAppliances: ['blender', 'blender', 'storage'],
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
