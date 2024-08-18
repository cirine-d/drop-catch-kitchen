import { memo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  CuboidCollider,
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
  Vector3Object,
  interactionGroups,
} from '@react-three/rapier';
import { PlayerControlKeys, IngredientName } from '../data/types';
import { BASKET_BOUNDS, BASKET_SENSOR, INGREDIENTS, colours } from '../data/constants';
import { getDirectionFromKey, isIngredientName } from '../utils';
import { IngredientSprite } from './IngredientSprite';
import { useGameState } from '../GameState/GameState';

interface Props {
  startPosition: Vector3Object;
  gamePanelBoundaries: {
    right: number;
    left: number;
  };
  removeIngredientFromScene?: (ingredientId: number, ingredientHandle: number) => void;
}

export const Basket: React.FC<Props> = (props: Props) => {
  const { content, updateContent } = useGameState().basket;
  const { activeAppliance } = useGameState();
  const basketRef = useRef<RapierRigidBody>();
  const [impulse, setImpulse] = useState<number>(0);
  const [contentDisplaySprites, setContentDisplaySprites] = useState<IngredientName[]>([]);

  const handleIngredientCaught = (ingredient: THREE.Object3D, rigidBodyHandle: number) => {
    if (isIngredientName(ingredient.name)) {
      updateContent(ingredient.name);
      updateContentDisplaySprites(ingredient.name);
    }
    props.removeIngredientFromScene(ingredient.id, rigidBodyHandle);
  };

  const updateContentDisplaySprites = (ingredient: IngredientName) => {
    const updatedContentDisplaySprites = [...contentDisplaySprites];
    updatedContentDisplaySprites.push(ingredient);
    setContentDisplaySprites(updatedContentDisplaySprites);
  };

  useEffect(() => {
    document.addEventListener('keydown', event => moveBasket(getDirectionFromKey(event)), false);
    document.addEventListener('keyup', event => setImpulse(0), false);
  }, []);

  useEffect(() => {
    basketRef.current.setLinvel({ x: impulse, y: 0, z: 0 }, true);
  }, [impulse]);

  const moveBasket = (direction: PlayerControlKeys) => {
    if (direction === 'left' && basketRef.current.translation().x >= props.gamePanelBoundaries.left) {
      return setImpulse(-5);
    }
    if (direction === 'right' && basketRef.current.translation().x <= props.gamePanelBoundaries.right) {
      return setImpulse(5);
    }
  };

  const Boundary = memo((boundaryProps: { position: 'left' | 'right' }) => {
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
  });

  const BasketMesh: React.FC = () => {
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
        {contentDisplaySprites.length > 0 && (
          <group name="BasketContentDisplay">
            {contentDisplaySprites[0] !== undefined && (
              <IngredientSprite
                position={[-0.6, 0.3, 0.8]}
                ingredientName={contentDisplaySprites[0]}
                isActive={activeAppliance?.acceptedIngredients.includes(contentDisplaySprites[0])}
              />
            )}
            {contentDisplaySprites[1] !== undefined && (
              <IngredientSprite
                position={[0, 0.3, 1]}
                ingredientName={contentDisplaySprites[1]}
                isActive={activeAppliance?.acceptedIngredients.includes(contentDisplaySprites[1])}
              />
            )}
            {contentDisplaySprites[2] !== undefined && (
              <IngredientSprite
                position={[0.6, 0.3, 0.8]}
                ingredientName={contentDisplaySprites[2]}
                isActive={activeAppliance?.acceptedIngredients.includes(contentDisplaySprites[2])}
              />
            )}
          </group>
        )}
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
        <BasketMesh />
      </RigidBody>
      <Boundary position="right" />
    </>
  );
};
