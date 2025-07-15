import { appliancesDictionary, ingredientsDictionary, levels, ordersDictionary } from './data/constants';
import {
  ApplianceBehaviour,
  applianceBehaviours,
  ApplianceName,
  IngredientName,
  LevelName,
  OrderName,
} from './data/types';

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

export const isOrderName = (value: string): value is OrderName => {
  return Object.keys(ordersDictionary).includes(value);
};

export const isLevelName = (value: string): value is LevelName => {
  return Object.keys(levels).includes(value);
};

export const isApplianceBehaviour = (value: any): value is ApplianceBehaviour => {
  return applianceBehaviours.includes(value);
};

export const applyContentLimitToArray = <T>(remainingCapacity: number, array: T[]): T[] => {
  if (remainingCapacity > 0) {
    return array.slice(0, remainingCapacity);
  }

  return [];
};

export const isAcceptedIngredient = (
  acceptedIngredients: IngredientName[],
  ingredientToCheck: IngredientName,
  isAcceptAllIngredients: boolean
): boolean => {
  if (acceptedIngredients.includes(ingredientToCheck) || isAcceptAllIngredients) {
    return true;
  }
  return false;
};
