import { ordersDictionary as untypedOrdersDictionary } from '../data/constants';
import { ApplianceName, IngredientName, Order, OrderName } from '../data/types';

export const findPossibleOrder = (
  content: IngredientName[],
  applianceName: ApplianceName,
  menu: OrderName[]
): Order => {
  const contentRecord: Partial<Record<IngredientName, number>> = content.reduce((acc, ingredient) => {
    acc[ingredient] = (acc[ingredient] || 0) + 1;
    return acc;
  }, {});
  const ordersDictionary = untypedOrdersDictionary as Record<OrderName, Order>;
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
