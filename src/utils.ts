import { appliancesDictionary, ingredientsDictionary } from './data/constants';
import { ApplianceName, IngredientName } from './data/types';

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

export const generateRandom = (min: number = 0, max: number = 100) => {
  const difference = max - min;
  const rand = Math.random();
  return Math.floor(rand * difference) + min;
};

export const generateItemFromWeightedList = <T>(weightedList: Map<T, number>): T => {
  let sum = 0;
  const r = Math.random();
  for (const [key, value] of weightedList.entries()) {
    sum += value;
    if (r <= sum) return key;
  }
};

export const getApplianceNameFromId = (id: string): ApplianceName => {
  const name = id.split('-')[0];
  if (!isApplianceName(name)) {
    throw new Error('Appliance id does not contain valid appliance name');
  }

  return name;
};

//TYPEGUARDS
export const isIngredientName = (value: string): value is IngredientName => {
  return Object.keys(ingredientsDictionary).includes(value);
};

export const isApplianceName = (value: string): value is ApplianceName => {
  return Object.keys(appliancesDictionary).includes(value);
};
