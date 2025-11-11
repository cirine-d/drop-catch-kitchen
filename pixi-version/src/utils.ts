import { Body } from 'matter-js';
import {
  appliancesDictionary,
  ingredientsDictionary,
  levels,
  menuItemDictionary,
  ordersDictionary,
} from './data/constants';
import {
  ApplianceBehaviour,
  applianceBehaviours,
  ApplianceName,
  BasketDirection,
  IngredientName,
  Level,
  LevelName,
  MenuItemName,
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
    if (r <= sum) {
      return key;
    }
  }
};

export const getApplianceNameFromId = (id: string): ApplianceName => {
  const name = id.split('-')[0];
  if (!isApplianceName(name)) {
    throw new Error('Appliance id does not contain valid appliance name');
  }
  return name;
};

export const generateCustomerOrder = (
  menu: Map<MenuItemName, number>,
  allowedOrders: OrderName[],
  customerPreferrences: OrderName[]
): MenuItemName[] => {
  const possibleCustomerOrder = customerPreferrences.filter(order => allowedOrders.includes(order));
  const customerOrderCategories =
    ordersDictionary[possibleCustomerOrder[Math.floor(Math.random() * possibleCustomerOrder.length)]];

  let orderedItems: MenuItemName[] = [];
  customerOrderCategories.forEach(category => {
    const availableMenuInCategory = new Map(
      Array.from(menu.entries()).filter(([itemName]) => {
        return menuItemDictionary[itemName].category === category;
      })
    );

    orderedItems.push(generateItemFromWeightedList<MenuItemName>(availableMenuInCategory));
  });

  return orderedItems;
};

export const getDirectionFromKey = (event): BasketDirection => {
  switch (event.code) {
    case 'KeyA':
      return 'left';
    case 'ArrowLeft':
      return 'left';
    case 'KeyD':
      return 'right';
    case 'ArrowRight':
      return 'right';
    case 'KeyW':
      return 'up';
    case 'ArrowUp':
      return 'up';
    case 'KeyS':
      return 'down';
    case 'ArrowDown':
      return 'down';
    default:
      null;
  }
};

//TYPEGUARDS
export const isIngredientName = (value: string): value is IngredientName => {
  return Object.keys(ingredientsDictionary).includes(value);
};

export const isApplianceName = (value: string): value is ApplianceName => {
  return Object.keys(appliancesDictionary).includes(value);
};

export const isMenuItemName = (value: string): value is MenuItemName => {
  return Object.keys(menuItemDictionary).includes(value);
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

export const restrictBodyMovementsToWindow = (body: Matter.Body) => {
  if (body.position.x < 0 + 50) {
    Body.setPosition(body, { x: 0 + 50, y: body.position.y });
    Body.setVelocity(body, { x: 0, y: 0 });
  }
  if (body.position.x > window.innerWidth - 50) {
    Body.setPosition(body, { x: window.innerWidth - 50, y: body.position.y });
    Body.setVelocity(body, { x: 0, y: 0 });
  }
};

export const isLevelEnabled = (completedLevels: Record<LevelName, number> | undefined, level: LevelName) => {
  const getLevelNumber = levelName => parseInt(levelName.split('_')[1]);

  if (Object.keys(completedLevels).length === 0 && getLevelNumber(level) === 1) {
    return true;
  }

  if (Object.keys(completedLevels).includes(level)) {
    return true;
  }

  if (
    Object.keys(completedLevels)
      .map(completedLevel => getLevelNumber(completedLevel))
      .toSorted((a, b) => b - a)[0] ===
    getLevelNumber(level) - 1
  ) {
    return true;
  }

  return false;
};
