import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { APPLIANCES, BASKET_SENSOR, appliancesDictionary } from '../../data/constants';
import { CuboidCollider, RigidBody, RigidBodyProps, interactionGroups } from '@react-three/rapier';
import { getApplianceNameFromId, isOrderName } from '../../utils';
import { Appliance as IAppliance } from '../../data/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IngredientSprite } from '../IngredientSprite';
import { PendingOrderDisplay } from './PendingOrderDisplay';
import { useBoundStore } from '../../store';
import { findPossibleOrder } from '../../store/utils';

interface Props extends RigidBodyProps {
  applianceId: string;
  appliance: IAppliance;
}

export const Appliance: React.FC<Props> = props => {
  const { appliances, setActiveAppliance, startCooking, currentLevel } = useBoundStore();
  const appliance = useMemo(() => appliances.get(props.applianceId), [appliances, props.applianceId]);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const texture = useLoader(TextureLoader, appliancesDictionary[getApplianceNameFromId(props.applianceId)].picture);
  const activeOverlaps = useRef(0);

  useEffect(() => {
    if (
      appliance.contentLimit === appliance.content.length &&
      !appliance.specialBehaviour.includes('cookingDisabled')
    ) {
      startCooking(
        props.applianceId,
        findPossibleOrder(appliance.content, appliance.name, Array.from(currentLevel.menu.keys()))
      );
    }
  }, [appliance.content]);

  const handleIntersectionEnter = () => {
    activeOverlaps.current += 1;
    if (activeOverlaps.current > 0) {
      setActiveAppliance(props.applianceId);
      setIsHighlighted(true);
    }
  };

  const handleIntersectionExit = () => {
    activeOverlaps.current -= 1;
    if (activeOverlaps.current <= 0) {
      setActiveAppliance(undefined);
      setIsHighlighted(false);
    }
  };

  return (
    <RigidBody {...props} name={props.applianceId} type="fixed">
      <CuboidCollider
        name={props.applianceId + '-sensor'}
        args={[0.1, 0.1, 0.1]}
        position={[0, 0.7, 0]}
        collisionGroups={interactionGroups(APPLIANCES, [BASKET_SENSOR])}
        sensor
        onIntersectionEnter={handleIntersectionEnter}
        onIntersectionExit={handleIntersectionExit}
      />
      <group name={props.applianceId}>
        {appliance.content.length > 0 && (
          <group name={props.applianceId + '-ContentDisplay'} position={[-0.2, 0.2, 0]}>
            {appliance.content[0] !== undefined && (
              <IngredientSprite position={[0, -0.3, 0.8]} ingredientName={appliance.content[0]} />
            )}
            {appliance.content[1] !== undefined && (
              <IngredientSprite position={[0.5, -0.3, 1]} ingredientName={appliance.content[1]} />
            )}
            {appliance.content[2] !== undefined && (
              <IngredientSprite position={[1, -0.3, 0.8]} ingredientName={appliance.content[2]} />
            )}
          </group>
        )}
        {appliance.pendingOrder !== undefined && (
          <PendingOrderDisplay
            applianceId={props.applianceId}
            orderPic={appliance.pendingOrder.picture}
            cookingTimer={appliance.cookingTimer}
          />
        )}
        <mesh>
          <planeGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            map={texture}
            transparent
            emissive={'#ffffff'}
            emissiveIntensity={isHighlighted ? 0.5 : 0}
          />
        </mesh>
      </group>
    </RigidBody>
  );
};
