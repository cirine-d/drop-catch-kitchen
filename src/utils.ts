import { ingredientsDictionary } from './data/constants';
import { IngredientName } from './data/types';

export const generateRandom = (min: number = 0, max: number = 100) => {
  const difference = max - min;
  const rand = Math.random();
  return Math.floor(rand * difference) + min;
};

export const copyStringIntoTypedArray = <T>(string: string, copies: number): T[] => {
  return string
    .concat(' ')
    .repeat(copies)
    .trimEnd()
    .split(' ')
    .map(x => x.trimEnd()) as T[];
};

export const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const getDirectionFromKey = event => {
  switch (event.keyCode) {
    case 37:
      return 'left';
    case 65:
      return 'left';
    case 39:
      return 'right';
    case 68:
      return 'right';
    default:
  }
};

//TYPEGUARDS
export const isIngredientName = (value: string): value is IngredientName => {
  return Object.keys(ingredientsDictionary).includes(value);
};

export const generateItemFromWeightedList = <T>(weightedList: Map<T, number>): T => {
  let sum = 0;
  const r = Math.random();
  for (const [key, value] of weightedList.entries()) {
    sum += value;
    if (r <= sum) return key;
  }
};
