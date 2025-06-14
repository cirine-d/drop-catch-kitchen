import { RigidBody, interactionGroups } from '@react-three/rapier';
import { INGREDIENTS, ingredientsDictionary } from '../data/constants';
import { useGLTF } from '@react-three/drei';

interface Props {
  name: string;
  startPosition: THREE.Vector3;
}
useGLTF.preload('assets/ingredients/strawberry.glb');

export const Ingredient: React.FC<Props> = (props: Props) => {
  const gltf = useGLTF('assets/ingredients/strawberry.glb');
  return (
    <RigidBody
      name={props.name}
      colliders="trimesh"
      collisionGroups={interactionGroups(INGREDIENTS)}
      linearDamping={2}
      restitution={2}
    >
      {/* <mesh name={props.name} position={[props.startPosition.x, props.startPosition.y, props.startPosition.z]}> */}
      <primitive object={gltf.scene} position={[props.startPosition.x, props.startPosition.y, props.startPosition.z]} />
      {/* <meshBasicMaterial color={ingredientsDictionary[props.name].color} /> */}
      {/* </mesh> */}
    </RigidBody>
  );
};
