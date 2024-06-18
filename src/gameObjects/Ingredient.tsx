import { RigidBody, interactionGroups } from '@react-three/rapier';
import { INGREDIENTS, ingredientsDictionary } from '../data/constants';

interface Props {
  name: string;
  startPosition: THREE.Vector3;
}

export const Ingredient: React.FC<Props> = (props: Props) => {
  return (
    <RigidBody name={props.name} colliders="trimesh" collisionGroups={interactionGroups(INGREDIENTS)} linearDamping={2}>
      <mesh name={props.name} position={[props.startPosition.x, props.startPosition.y, props.startPosition.z]}>
        <icosahedronGeometry args={[0.4]} />
        <meshBasicMaterial color={ingredientsDictionary[props.name].color} />
      </mesh>
    </RigidBody>
  );
};
