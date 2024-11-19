import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  CuboidCollider,
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
  Vector3Object,
  interactionGroups,
} from '@react-three/rapier';
import { PlayerControls } from '../data/types';
import { BASKET_BOUNDS, BASKET_LID, BASKET_SENSOR, INGREDIENTS, colours } from '../data/constants';
import { isAcceptedIngredient, isIngredientName } from '../utils';
import { IngredientSprite } from './IngredientSprite';
import { useKeyboardControls } from '@react-three/drei';
import { useBoundStore } from '../store';

interface Props {
  startPosition: Vector3Object;
  gamePanelBoundaries: {
    right: number;
    left: number;
  };
  removeIngredientFromScene?: (ingredientId: number, ingredientHandle: number) => void;
}

export const Basket: React.FC<Props> = (props: Props) => {
  const {
    appliances,
    activeApplianceId,
    transferIngredientsFromBasket,
    basketContent,
    isBasketFull,
    setBasketContent,
    collectPendingOrder,
  } = useBoundStore();
  const leftPressed = useKeyboardControls<PlayerControls>(state => state.left);
  const rightPressed = useKeyboardControls<PlayerControls>(state => state.right);
  const downPressed = useKeyboardControls<PlayerControls>(state => state.down);
  const upPressed = useKeyboardControls<PlayerControls>(state => state.up);
  const basketRef = useRef<RapierRigidBody>();
  const [impulse, setImpulse] = useState<number>(0);

  const activeAppliance = useMemo(() => appliances.get(activeApplianceId), [appliances, activeApplianceId]);

  const handleIngredientCaught = useCallback(
    (ingredient: THREE.Object3D, rigidBodyHandle: number) => {
      if (isIngredientName(ingredient.name)) {
        setBasketContent('adding', [ingredient.name]);
      }
      props.removeIngredientFromScene(ingredient.id, rigidBodyHandle);
    },
    [setBasketContent, props.removeIngredientFromScene]
  );

  useEffect(() => {
    basketRef.current.setLinvel({ x: impulse, y: 0, z: 0 }, true);
  }, [impulse]);

  useEffect(() => {
    basketRef.current.setTranslation(
      { x: props.startPosition.x - 0.5, y: props.startPosition.y, z: props.startPosition.z },
      true
    );
  }, []);

  useEffect(() => {
    if (leftPressed && basketRef.current.translation().x >= props.gamePanelBoundaries.left) {
      return setImpulse(-5);
    }
    if (rightPressed && basketRef.current.translation().x <= props.gamePanelBoundaries.right) {
      return setImpulse(5);
    }
    if (downPressed) {
      transferIngredientsFromBasket();
    }
    if (upPressed && activeAppliance) {
      collectPendingOrder(activeApplianceId);
    }

    setImpulse(0);
  }, [rightPressed, leftPressed, downPressed, upPressed, activeAppliance]);

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
        {basketContent.length > 0 && <BasketContentDisplay />}
      </group>
    );
  };

  const BasketContentDisplay: React.FC = () => (
    <group name="BasketContentDisplay">
      {basketContent[0] !== undefined && (
        <IngredientSprite
          position={[-0.6, 0.3, 0.8]}
          ingredientName={basketContent[0]}
          isActive={
            activeAppliance ? isAcceptedIngredient(activeAppliance?.acceptedIngredients, basketContent[0]) : false
          }
        />
      )}
      {basketContent[1] !== undefined && (
        <IngredientSprite
          position={[0, 0.3, 1]}
          ingredientName={basketContent[1]}
          isActive={
            activeAppliance ? isAcceptedIngredient(activeAppliance?.acceptedIngredients, basketContent[1]) : false
          }
        />
      )}
      {basketContent[2] !== undefined && (
        <IngredientSprite
          position={[0.6, 0.3, 0.8]}
          ingredientName={basketContent[2]}
          isActive={
            activeAppliance ? isAcceptedIngredient(activeAppliance?.acceptedIngredients, basketContent[2]) : false
          }
        />
      )}
    </group>
  );

  return (
    <>
      <Boundary position="left" />
      <RigidBody colliders="trimesh" ref={basketRef} gravityScale={0} lockRotations lockTranslations>
        {isBasketFull() && (
          <CylinderCollider
            name="BasketLid"
            args={[0.2, 0.8]}
            position={[0, 0.6, 0]}
            collisionGroups={interactionGroups(BASKET_LID, [INGREDIENTS])}
          >
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[1, 1, 0.2, 6]} />
              <meshBasicMaterial color={colours.BROWN} />
            </mesh>
          </CylinderCollider>
        )}
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
