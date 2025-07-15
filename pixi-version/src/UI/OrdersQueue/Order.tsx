import React from 'react';
import { Order as IOrder } from '../../data/types';

interface Props {
  order: IOrder;
}

export const Order: React.FC<Props> = props => {
  switch (props.order.status) {
    case 'pending':
      return (
        <>
          <div>{props.order.name}</div>
          <div>{props.order.timer}</div>
        </>
      );
    case 'timedOut':
      return (
        <>
          <div>{props.order.name}</div>
          <div>FAILED</div>
        </>
      );
    case 'completed':
      return (
        <>
          <div>{props.order.name}</div>
          <div>+{props.order.price}!!</div>
        </>
      );
    default:
  }
};
