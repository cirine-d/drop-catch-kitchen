import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { APPLIANCES, BASKET_SENSOR, appliancesDictionary } from '../../data/constants';
import { CuboidCollider, RigidBody, RigidBodyProps, interactionGroups } from '@react-three/rapier';
import { getApplianceNameFromId } from '../../utils';
import { Appliance as IAppliance } from '../../data/types';
import { useApplianceObject } from '../../hooks/useApplianceObject';

interface Props extends RigidBodyProps {
  applianceId: string;
  appliance: IAppliance;
}

export const Appliance: React.FC<Props> = props => {
  const appliance = useApplianceObject(props.appliance);

  const texture = useLoader(TextureLoader, appliancesDictionary[getApplianceNameFromId(props.applianceId)].picture);
  console.log(props.applianceId, 'content', appliance.content);
  return (
    <RigidBody {...props} name={props.applianceId} type="fixed">
      <CuboidCollider
        name={props.applianceId + '-sensor'}
        args={[0.4, 0.1, 0.2]}
        position={[0, 0.5, 0]}
        collisionGroups={interactionGroups(APPLIANCES, [BASKET_SENSOR])}
        sensor
        // onIntersectionEnter={() => {
        //   console.log('hi'), appliance.updateContent(['apple']);
        // }}
        onIntersectionExit={() => console.log(props.applianceId + ' exit')}
      />
      <mesh>
        <planeGeometry args={[2, 2, 2]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </RigidBody>
  );
};
