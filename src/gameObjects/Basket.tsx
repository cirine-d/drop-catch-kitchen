import * as THREE from 'three';
import { BasketDirection, Ingredient, IngredientName } from '../data/types';
import { BASKET_BOUNDS, BASKET_SENSOR, INGREDIENTS, colours } from '../data/constants';
import { getDirectionFromKey, isIngredientName } from '../utils';
import { useEffect, useRef, useState } from 'react';
import { CuboidCollider, CylinderCollider, RapierRigidBody, RigidBody, interactionGroups } from '@react-three/rapier';
import RAPIER from '@dimforge/rapier3d-compat';

interface Props {
  startPosition: RAPIER.Vector3;
  gamePanelBoundaries: {
    right: number;
    left: number;
  };
  updateIngredientsCaught?: (ingredient: IngredientName) => void;
  removeIngredientFromScene?: (ingredientId: number, ingredientHandle: number) => void;
}

export const Basket: React.FC<Props> = (props: Props) => {
  const basketRef = useRef<RapierRigidBody>();
  const [impulse, setImpulse] = useState<number>(0);

  // const ref = useRef<THREE.Mesh>();
  // const [contents, setContents] = useState<HashMap<number>>({});
  // const [contentIds, setContentIds] = useState<number[]>([]);

  // const handleIngredients = (id: string) => {
  //   // const newContentIds = [...contentIds];
  //   // if (contentIds.includes(ingredient.object.id)) {
  //   //   return;
  //   // }

  //   // if (contents[ingredient.name]) {
  //   //   contents[ingredient.name] += 1;
  //   // } else {
  //   //   contents[ingredient.name] = 1;
  //   // }

  //   // setContentIds([...newContentIds, ingredient.object.id]);

  //   console.log();
  // };

  const handleIngredientCaught = (ingredient: THREE.Object3D, rigidBodyHandle: number) => {
    if (isIngredientName(ingredient.name)) {
      props.updateIngredientsCaught(ingredient.name);
    }
    props.removeIngredientFromScene(ingredient.id, rigidBodyHandle);
  };

  useEffect(() => {
    // if (props.startPosition && basketRef.current) {
    //   basketRef.current.setNextKinematicTranslation(props.startPosition);
    // }
    document.addEventListener('keydown', event => moveBasket(getDirectionFromKey(event)), false);
    document.addEventListener('keyup', event => setImpulse(0), false);
  }, []);

  useEffect(() => {
    basketRef.current.setLinvel({ x: impulse, y: 0, z: 0 }, true);
  }, [impulse]);

  const moveBasket = (direction: BasketDirection) => {
    if (direction === 'left' && basketRef.current.translation().x >= props.gamePanelBoundaries.left) {
      return setImpulse(-5);
    }
    if (direction === 'right' && basketRef.current.translation().x <= props.gamePanelBoundaries.right) {
      return setImpulse(5);
    }
  };

  const Boundary = (boundaryProps: { position: 'left' | 'right' }) => {
    const boundaryOffset = 0.7;
    return (
      <RigidBody
        type="fixed"
        position={[
          boundaryProps.position === 'left'
            ? props.gamePanelBoundaries.left - boundaryOffset
            : props.gamePanelBoundaries.right + boundaryOffset,
          props.startPosition.y,
          props.startPosition.z,
        ]}
      >
        <CuboidCollider
          args={[0.1, 1, 1]}
          collisionGroups={interactionGroups(BASKET_BOUNDS)}
          sensor
          onCollisionEnter={() => setImpulse(0)}
        />
      </RigidBody>
    );
  };

  const BasketMesh = () => {
    const points = [];
    points.push(new THREE.Vector2(1, 0));
    points.push(new THREE.Vector2(1, 0.7)); // The widest point of the basket
    points.push(new THREE.Vector2(1, 0));
    return (
      <group name="Basket">
        <mesh>
          <latheGeometry args={[points, 6]} />
          <meshBasicMaterial color={colours.BROWN} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0.53]}>
          <circleGeometry args={[1, 6]} />
          <meshBasicMaterial color={colours.BROWN} />
        </mesh>
      </group>
    );
  };

  return (
    <>
      <Boundary position="left" />
      <RigidBody
        colliders="trimesh"
        ref={basketRef}
        gravityScale={0}
        lockRotations
        lockTranslations
        position={[props.startPosition.x - 0.5, props.startPosition.y, props.startPosition.z]}
      >
        <CylinderCollider
          name="BasketSensor"
          args={[0.02, 0.8]}
          collisionGroups={interactionGroups(BASKET_SENSOR, [INGREDIENTS])}
          sensor
          onIntersectionEnter={payload => handleIngredientCaught(payload.rigidBodyObject, payload.rigidBody.handle)}
        />
        {BasketMesh()}
      </RigidBody>
      <Boundary position="right" />
    </>
  );
};
