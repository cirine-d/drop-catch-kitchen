import { StateCreator } from 'zustand';
import { ContentUpdateMode, IngredientName, Order, OrderName } from '../../data/types';
import { BoundSlices } from '..';
import { generateItemFromWeightedList } from '../../utils';
import { ordersDictionary } from '../../data/constants';

export interface Orders {
  orderQueue: Order[];
  orderSchedulingTimeout: number | null;
  scheduleNextOrder: () => void;
  stopOrderScheduling: () => void;
  updateOrderTimers: () => void;
  tryMarkOrderCompleted: (orderName: OrderName) => boolean;
}

export const createOrdersSlice: StateCreator<BoundSlices, [], [], Orders> = (set, get) => ({
  orderQueue: [],
  orderSchedulingTimeout: null,

  scheduleNextOrder: () => {
    const addOrder = () => {
      const menu = get().currentLevel.menu;
      const orderName = generateItemFromWeightedList<OrderName>(menu);
      const order: Order = {
        name: orderName,
        timer: ordersDictionary[orderName].cookingTime,
        status: 'pending',
        picture: ordersDictionary[orderName].picture,
        price: ordersDictionary[orderName].price,
      };
      get().orderQueue.push(order);
      console.log(get().orderQueue, 'hii');
    };

    const randomDelay = Math.random() * 8000 + 3000;
    const schedulingTimeout = setTimeout(() => {
      addOrder();
      get().scheduleNextOrder();
    }, randomDelay);

    set({ orderSchedulingTimeout: schedulingTimeout });
  },

  stopOrderScheduling: () => {
    const schedulingTimeout = get().orderSchedulingTimeout;
    if (schedulingTimeout !== null) {
      clearTimeout(schedulingTimeout);
      set({ orderSchedulingTimeout: null });
    }
  },

  updateOrderTimers: () => {
    get().orderQueue.forEach((order, index) => {
      if (order.status === 'pending' && order.timer > 0) {
        order.timer--;
      }

      if (order.timer === 0) {
        order.status = 'timedOut';
        setTimeout(() => {
          const updatedOrderQueue = get().orderQueue;
          updatedOrderQueue.splice(index, 1);
          set({ orderQueue: updatedOrderQueue });
        }, 1000);
      }
    });
  },

  tryMarkOrderCompleted: (orderName: OrderName) => {
    const orderIndex = get().orderQueue.findIndex(order => order.name === orderName);

    if (orderIndex !== -1) {
      const updatedOrderQueue = get().orderQueue;

      updatedOrderQueue.splice(orderIndex, 1);

      set({
        orderQueue: updatedOrderQueue,
      });
      return true;
    }

    return false;
  },
});
