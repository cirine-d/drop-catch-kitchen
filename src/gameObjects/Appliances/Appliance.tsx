import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { APPLIANCES, BASKET_SENSOR, appliancesDictionary } from '../../data/constants';
import { CuboidCollider, RigidBody, RigidBodyProps, interactionGroups } from '@react-three/rapier';
import { getApplianceNameFromId } from '../../utils';
import { Appliance as IAppliance } from '../../data/types';
import { useApplianceObject } from '../../hooks/useApplianceObject';
import { useGameState } from '../../GameState/GameState';
import { useRef, useState } from 'react';

interface Props extends RigidBodyProps {
  applianceId: string;
  appliance: IAppliance;
}

export const Appliance: React.FC<Props> = props => {
  const { setActiveAppliance } = useGameState();
  const appliance = useApplianceObject(props.appliance);
  const [isGlowing, setIsGlowing] = useState<boolean>(false);
  console.log(isGlowing, props.applianceId);
  const texture = useLoader(TextureLoader, appliancesDictionary[getApplianceNameFromId(props.applianceId)].picture);
  const activeOverlaps = useRef(0);

  const handleIntersectionEnter = () => {
    activeOverlaps.current += 1;
    if (activeOverlaps.current > 0) {
      setActiveAppliance(props.applianceId);
      setIsGlowing(true);
    }
  };

  const handleIntersectionExit = () => {
    activeOverlaps.current -= 1;
    if (activeOverlaps.current <= 0) {
      setActiveAppliance(undefined);
      setIsGlowing(false);
    }
  };

  return (
    <RigidBody {...props} name={props.applianceId} type="fixed">
      <CuboidCollider
        name={props.applianceId + '-sensor'}
        args={[0.1, 0.1, 0.1]}
        position={[0, 0.5, 0]}
        collisionGroups={interactionGroups(APPLIANCES, [BASKET_SENSOR])}
        sensor
        onIntersectionEnter={handleIntersectionEnter}
        onIntersectionExit={handleIntersectionExit}
      />
      <mesh>
        <planeGeometry args={[2, 2, 2]} />
        <meshStandardMaterial map={texture} transparent emissive={'#ffffff'} emissiveIntensity={isGlowing ? 0.5 : 0} />
      </mesh>
    </RigidBody>
  );
};
