import React from 'react';
import { useBoundStore } from '../../store';
import { Order } from './Order';

export const OrdersQueue: React.FC = () => {
  const { orderQueue } = useBoundStore();
  console.log(orderQueue);
  return (
    <div id="ordersQueue">
      {orderQueue.map(order => (
        <Order order={order} />
      ))}
    </div>
  );
};
