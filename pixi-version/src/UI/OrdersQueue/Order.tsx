import React from 'react';
import { Order as IOrder } from '../../data/types';
import { menuItemDictionary } from '../../data/constants';

interface Props {
  order: IOrder;
}

export const Order: React.FC<Props> = props => {
  switch (props.order.status) {
    case 'pending':
      return (
        <>
          <img src={`/public/${props.order.customerPicture}`} width={'80px'} />
          {props.order.pendingItems.map(item => (
            <img
              src={`/public/${menuItemDictionary[item.name].picture}`}
              width={'80px'}
              style={{
                border: item.fulfilled ? '2px, solid green' : null,
              }}
            />
          ))}
          <div>{props.order.timer}</div>
        </>
      );
    case 'timedOut':
      return (
        <>
          <img src={`/public/${props.order.customerPicture}`} width={'80px'} />
          <div>FAILED</div>
        </>
      );
    case 'completed':
      return (
        <>
          <img src={`/public/${props.order.customerPicture}`} width={'80px'} />
          <div>THANK YOU</div>
          <div>+{props.order.price}!!</div>
        </>
      );
    default:
  }
};
