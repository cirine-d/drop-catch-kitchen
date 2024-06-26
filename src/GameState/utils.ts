import { ordersDictionary } from '../data/constants';
import { Appliance, ApplianceName, IngredientName, OrderName } from '../data/types';

export const generateWeightedInventoryFromMenu = (menu: Map<OrderName, number>): Map<IngredientName, number> => {
  const weightedInventory: Map<IngredientName, number> = new Map();

  menu.forEach((orderWeight, orderName) => {
    const orderDetails = ordersDictionary[orderName];
    if (!orderDetails) return;

    Object.entries(orderDetails.recipe).forEach(([ingredient, quantity]) => {
      const ingredientName = ingredient as IngredientName;
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
  isStorageEnabled: boolean
): Map<string, Appliance | undefined> => {
  const appliancesMap = new Map<string, Appliance | undefined>();
  const allAppliances = Array.from(menu).map(([orderName]) => ordersDictionary[orderName].appliance as ApplianceName);

  if (isStorageEnabled) {
    allAppliances.push('storage');
  }

  const applianceNames = [...new Set(allAppliances)];
  applianceNames.forEach((name, index) => appliancesMap.set(`${name}-${index}`, undefined));

  return appliancesMap;
};
