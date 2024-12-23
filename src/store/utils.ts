import { appliancesDictionary, ordersDictionary as untypedOrdersDictionary } from '../data/constants';
import { Appliance, ApplianceName, IngredientName, Order, OrderName } from '../data/types';
import { isAcceptedIngredient, isApplianceBehaviour, isIngredientName } from '../utils';

const ordersDictionary = untypedOrdersDictionary as Record<OrderName, Order>;

export const generateWeightedInventoryFromMenu = (menu: Map<OrderName, number>): Map<IngredientName, number> => {
  const weightedInventory: Map<IngredientName, number> = new Map();

  menu.forEach((orderWeight, orderName) => {
    const orderDetails = ordersDictionary[orderName];
    if (!orderDetails) return;

    Object.entries(orderDetails.recipe).forEach(([ingredient, quantity]) => {
      if (!isIngredientName(ingredient)) {
        return;
      }

      const ingredientName = ingredient;
      const weightContribution = orderWeight * quantity;

      if (weightedInventory.has(ingredientName)) {
        weightedInventory.set(ingredientName, weightedInventory.get(ingredientName)! + weightContribution);
      } else {
        weightedInventory.set(ingredientName, weightContribution);
      }
    });
  });

  // Normalize the weights so that they sum to 1
  const totalWeight = Array.from(weightedInventory.values()).reduce((sum, weight) => sum + weight, 0);

  if (totalWeight > 0) {
    weightedInventory.forEach((weight, ingredient) => {
      weightedInventory.set(ingredient, weight / totalWeight);
    });
  }

  return weightedInventory;
};

export const createAppliancesMap = (
  menu: Map<OrderName, number>,
  extraAppliances: ApplianceName[]
): Map<string, Appliance> => {
  const appliancesMap = new Map<string, Appliance | undefined>();
  const allAppliances = Array.from(menu).map(([orderName]) => ordersDictionary[orderName].appliance);
  const applianceNames = [...new Set(allAppliances), ...extraAppliances];

  applianceNames.forEach((name, index) => {
    appliancesMap.set(`${name}-${index}`, createApplianceObject(name));
  });

  return appliancesMap;
};

const createApplianceObject = (applianceName: ApplianceName): Appliance => {
  const acceptedIngredients: IngredientName[] = Object.values(ordersDictionary)
    .filter(order => order.appliance === applianceName)
    .flatMap(order => Object.keys(order.recipe))
    .filter(isIngredientName);

  return {
    name: applianceName,
    content: [],
    acceptedIngredients,
    contentLimit: appliancesDictionary[applianceName].contentLimit,
    isActive: false,
    cookingTimer: 0,
    specialBehaviour: appliancesDictionary[applianceName].specialBehaviour.filter(isApplianceBehaviour),
  };
};

export const isIngredientTransferPossible = (
  activeAppliance: Appliance | undefined,
  ingredients: IngredientName[]
): boolean => {
  if (activeAppliance === undefined) {
    return false;
  }

  if (activeAppliance.content.length === activeAppliance.contentLimit || activeAppliance.cookingTimer > 0) {
    return false;
  }

  const validIngredients = ingredients.filter(ingredient =>
    isAcceptedIngredient(
      activeAppliance.acceptedIngredients,
      ingredient,
      activeAppliance.specialBehaviour.includes('acceptAllIngredients')
    )
  );

  if (validIngredients.length > 0) {
    return true;
  }
};

export const findPossibleOrder = (
  content: IngredientName[],
  applianceName: ApplianceName,
  menu: OrderName[]
): Order => {
  const contentRecord: Partial<Record<IngredientName, number>> = content.reduce((acc, ingredient) => {
    acc[ingredient] = (acc[ingredient] || 0) + 1;
    return acc;
  }, {});
  const ordersFilteredByAppliance = menu.filter(orderName => ordersDictionary[orderName].appliance === applianceName);
  if (ordersFilteredByAppliance.length === 0) {
    return ordersDictionary['failedOrder'];
  }

  const ordersFilteredByIngredients = ordersFilteredByAppliance.filter(order =>
    areRecordsEqual(contentRecord, ordersDictionary[order].recipe)
  );

  if (ordersFilteredByIngredients.length === 0) {
    return ordersDictionary['failedOrder'];
  }

  if (ordersFilteredByIngredients.length > 1) {
    throw new Error('findPossibleOrder function found more than 1 match');
  }

  return ordersDictionary[ordersFilteredByIngredients[0]];
};

const areRecordsEqual = (record1: Record<string, number>, record2: Record<string, number>): boolean => {
  if (Object.keys(record1).length !== Object.keys(record2).length) {
    return false;
  }

  for (const key of Object.keys(record1)) {
    if (record1[key] !== record2[key]) {
      return false;
    }
  }

  return true;
};
