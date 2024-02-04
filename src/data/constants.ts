import { HashMap, Ingredient, Level } from './types';

export const colours = {
  PINK: '#f6a5c0',
  YELLOW: '#ffc107',
  GREEN: '#4caf50',
  RED: '#f44336',
  BROWN: '#795548',
};

export const ingredientsDictionary = {
  strawberry: {
    color: colours.RED,
  },
  banana: {
    color: colours.YELLOW,
  },
  apple: {
    color: colours.GREEN,
  },
};

export const levels: HashMap<Level> = {
  level_1: {
    recipe: {
      strawberry: 2,
      banana: 2,
    },
    inventory: {
      strawberry: 3,
      banana: 4,
      apple: 3,
    },
    timer: 100,
  },
};

export const MENU_Z_INDEX = 8;
export const LEVEL_Z_INDEX = 0;
export const SCALE_DIVIDER = 150;
export const CAMERA_Z_OFFSET = 4;

export const GAME_PANEL = 'GamePanel';
