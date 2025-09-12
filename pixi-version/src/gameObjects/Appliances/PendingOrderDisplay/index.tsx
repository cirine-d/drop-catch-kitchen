import { FC, useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { OrderSprite } from './OrderSprite';
import { Container } from 'pixi.js';

interface Props {
  position: { x: number; y: number };
  orderPic: string;
  cookingTimer: number;
  applianceId: string;
}

export const PendingOrderDisplay: FC<Props> = props => {
  return (
    <pixiContainer position={props.position}>
      <OrderSprite orderPic={props.orderPic} cookingTimer={props.cookingTimer} />
      <ProgressBar cookingTime={props.cookingTimer} />
    </pixiContainer>
  );
};
