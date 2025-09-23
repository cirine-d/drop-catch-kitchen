import { StateCreator } from 'zustand';
import {
  ContentUpdateMode,
  IngredientName,
  Order,
  MenuItemName,
  CustomerName,
  MenuItem,
  Customer,
  PendingMenuItem,
} from '../../data/types';
import { BoundSlices } from '..';
import { generateCustomerOrder, generateItemFromWeightedList } from '../../utils';
import { customerDictionary, menuItemDictionary, ordersDictionary } from '../../data/constants';
import { OrdersQueue } from '../../UI/OrdersQueue';

const orderQueueLimit = 4;

export interface Orders {
  orderQueue: Order[];
  orderSchedulingInterval: number | null;
  addOrder: () => void;
  removeOrder: (orderId: string) => void;
  startOrderScheduling: () => void;
  stopOrderScheduling: () => void;
  updateOrderTimersAndStatus: () => void;
  tryMatchMenuItemToPendingOrders: (orderName: MenuItemName) => void;
}

export const createOrdersSlice: StateCreator<BoundSlices, [], [], Orders> = (set, get) => ({
  orderQueue: [],
  orderSchedulingInterval: null,
  addOrder: () => {
    const menu = get().currentLevel.menu;
    const customers = get().currentLevel.customers;
    const customer: Customer = customerDictionary[generateItemFromWeightedList<CustomerName>(customers)];
    const possibleOrdersForLevel = get().currentLevel.allowedOrders;
    const orderedItems = generateCustomerOrder(menu, possibleOrdersForLevel, customer.orderPreferrence);

    const pendingItems: PendingMenuItem[] = [];
    let timeAllowedForOrder = 60;
    let totalPrice = 0;
    orderedItems.forEach(item => {
      timeAllowedForOrder += menuItemDictionary[item].cookingTime;
      totalPrice += menuItemDictionary[item].price;
      pendingItems.push({ name: item, fulfilled: false });
    });
    // TODO add patienceRating effect on timeallowed

    const order: Order = {
      id: crypto.randomUUID(),
      pendingItems: pendingItems,
      timer: timeAllowedForOrder,
      totalPrice: totalPrice,
      status: 'pending',
      menuItemPictures: orderedItems.map(item => menuItemDictionary[item].picture),
      customerPicture: customer.picture,
    };
    get().orderQueue.push(order);
  },

  removeOrder: (orderId: string) => {
    const updatedOrderQueue = [...get().orderQueue].filter(order => order.id !== orderId);
    set({ orderQueue: updatedOrderQueue });
  },

  startOrderScheduling: () => {
    const interval = setInterval(() => {
      if (Math.random() < 0.7 && get().orderQueue.length <= orderQueueLimit - 1) {
        // 70% chance this tick spawns an order
        get().addOrder();
      }
    }, 2000);

    set({ orderSchedulingInterval: interval });
  },

  stopOrderScheduling: () => {
    clearInterval(get().orderSchedulingInterval);
    set({ orderSchedulingInterval: null });
  },

  updateOrderTimersAndStatus: () => {
    get().orderQueue.forEach((order, index) => {
      if (order.status === 'pending' && order.timer > 0) {
        order.timer--;
      }

      if (order.timer === 0) {
        order.status = 'timedOut';
      }

      if (order.status === 'timedOut' || order.status === 'completed') {
        setTimeout(() => {
          get().removeOrder(order.id);
        }, 1000);
      }
    });
  },

  tryMatchMenuItemToPendingOrders: (menuItem: MenuItemName) => {
    const { orderQueue, profitMade } = get();

    // Sort order queue by smallest timer first
    const sortedQueue = [...orderQueue].sort((a, b) => a.timer - b.timer);

    const matchedOrder = sortedQueue.find(order =>
      order.pendingItems.some(item => item.name === menuItem && !item.fulfilled)
    );

    if (matchedOrder === undefined) {
      const penalty = menuItemDictionary[menuItem]?.price ?? 1;
      set({ profitMade: profitMade - penalty });
      return;
    }

    const matchedItemIndex = matchedOrder.pendingItems.findIndex(item => item.name === menuItem && !item.fulfilled);
    matchedOrder.pendingItems[matchedItemIndex].fulfilled = true;

    const isAllPendingItemsFulfilled = matchedOrder.pendingItems.every(item => item.fulfilled === true);

    if (isAllPendingItemsFulfilled) {
      matchedOrder.status = 'completed';
      set({ profitMade: profitMade + matchedOrder.totalPrice });
    }

    const indexToUpdate = orderQueue.findIndex(order => order.id === matchedOrder.id);
    orderQueue.splice(indexToUpdate, 1, matchedOrder);
  },
});
