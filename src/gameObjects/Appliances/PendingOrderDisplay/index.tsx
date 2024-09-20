import { GroupProps, useLoader } from '@react-three/fiber';
import { ProgressBar } from './ProgressBar';
import { TextureLoader } from 'three';
import { OrderSprite } from './OrderSprite';

interface Props extends Pick<GroupProps, 'position'> {
  orderPic: string;
  cookingTimer: number;
  applianceId: string;
}

export const PendingOrderDisplay: React.FC<Props> = props => {
  return (
    <group position={props.position}>
      <OrderSprite position={[0.5, 0.5, 1]} orderPic={props.orderPic} cookingTimer={props.cookingTimer} />
      <ProgressBar position={[0.5, -0.1, 1]} cookingTime={props.cookingTimer} />
    </group>
  );
};
