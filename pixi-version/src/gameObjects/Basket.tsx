import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BASKET_BOUNDS, BASKET_LID, BASKET_SENSOR, INGREDIENTS, colours } from '../data/constants';
import { getDirectionFromKey, isAcceptedIngredient, isIngredientName, restrictBodyMovementsToWindow } from '../utils';
import { IngredientSprite } from './IngredientSprite';
import { useBoundStore } from '../store';
import Matter, { Bodies, Body, Common, Composite, Composites, Events, Vertices, World } from 'matter-js';
import { useGameWindowBoundaries, useKeyboardControls } from '../store/utilityHooks';
import { BasketMatter } from './PhysicsBodies/Basket';
import { useApplication, useTick } from '@pixi/react';
import { Assets, Texture, Sprite, Container } from 'pixi.js';
import { useSyncSpriteToMatter } from './utilityHooks';
import { IngredientName } from '../data/types';

export const Basket: FC = () => {
  const {
    engine,
    world,
    appliances,
    activeApplianceId,
    gameState,
    basketContent,
    removeBody,
    outputIngredientsFromBasket,
    inputIngredientsToBasket,
    isBasketFull,
    setBasketContent,
    collectPendingOrder,
  } = useBoundStore();
  const { app } = useApplication();
  const { basketDirection } = useKeyboardControls();
  const gameBoundaries = useGameWindowBoundaries();
  const basketBodyRef = useRef<Matter.Body[]>(BasketMatter.bodies);
  const basketGroupRef = useRef<Container | null>(null);
  const [impulse, setImpulse] = useState<number>(0);
  const [basketEmptyTexture, setbasketEmptyTexture] = useState(Texture.EMPTY);
  const [basketFulltexture, setbasketFulltexture] = useState(Texture.EMPTY);

  const startPosition = { x: gameBoundaries.left + 100, y: gameBoundaries.bottom - 100 };
  const activeAppliance = useMemo(() => appliances.get(activeApplianceId), [appliances, activeApplianceId]);

  useEffect(() => {
    Composite.translate(BasketMatter, { x: startPosition.x, y: startPosition.y });
    Composite.add(world, [BasketMatter]);

    if (basketEmptyTexture === Texture.EMPTY) {
      Assets.load('assets/basketEmpty.png').then(result => {
        setbasketEmptyTexture(result);
      });
    }
    if (basketFulltexture === Texture.EMPTY) {
      Assets.load('assets/basketFull.png').then(result => {
        setbasketFulltexture(result);
      });
    }
  }, []);

  const basketBody = useMemo(() => basketBodyRef.current[0], [basketBodyRef]);
  const basketLid = useMemo(() => basketBodyRef.current[2], [basketBodyRef]);

  const { spriteRef, updateSprite } = useSyncSpriteToMatter(basketBody, basketGroupRef.current, {
    disableRotationSync: true,
    // positionOffset: { x: 0, y: -10 },
  });
  console.log(basketContent);
  Events.on(engine, 'beforeUpdate', () => basketBodyRef.current.forEach(restrictBodyMovementsToWindow));

  const handleIngredientCaught = useCallback(
    (ingredientName: IngredientName, physicsId: number) => {
      removeBody(world.bodies.find(body => body.id === physicsId));
      const syncedSprite = app.stage.children.find(child => child.label === physicsId.toString());
      app.stage.removeChild(syncedSprite);
      if (isIngredientName(ingredientName)) {
        setBasketContent('adding', [ingredientName]);
      }
    },
    [setBasketContent]
  );

  Events.on(engine, 'collisionStart', event => {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;

      if (
        (isIngredientName(bodyA.label) && bodyB.label === 'basketSensor') ||
        (bodyA.label === 'basketSensor' && isIngredientName(bodyB.label))
      ) {
        const caughtBody = isIngredientName(bodyA.label) ? bodyA : bodyB;
        handleIngredientCaught(caughtBody.label, caughtBody.id);
      }
    }
  });

  useTick(ticker => {
    updateSprite();
    if (impulse && gameState === 'playing') {
      basketBodyRef.current.forEach(body => {
        Body.setPosition(body, {
          x: body.position.x + impulse,
          y: body.position.y,
        });
      });
    }

    if (isBasketFull()) {
      basketLid.isSensor = false;
    }

    if (!isBasketFull()) {
      basketLid.isSensor = true;
    }
  });

  useEffect(() => {
    if (basketDirection === 'left' && basketBody.position.x >= 0) {
      return setImpulse(-5);
    }
    if (basketDirection === 'right' && basketBody.position.x <= window.outerWidth) {
      return setImpulse(5);
    }
    if (basketDirection === 'down') {
      outputIngredientsFromBasket();
    }
    if (basketDirection === 'up' && activeAppliance) {
      collectPendingOrder(activeApplianceId);
      inputIngredientsToBasket();
    }

    setImpulse(0);
  }, [basketDirection, activeAppliance]);

  const BasketContentDisplay: FC = () => (
    <>
      {basketContent[0] !== undefined && (
        <IngredientSprite
          position={[-0.6, 0.3, 0.8]}
          ingredientName={basketContent[0]}
          isActive={
            activeAppliance
              ? isAcceptedIngredient(
                  activeAppliance?.acceptedIngredients,
                  basketContent[0],
                  activeAppliance.specialBehaviour.includes('acceptAllIngredients')
                )
              : false
          }
        />
      )}
      {basketContent[1] !== undefined && (
        <IngredientSprite
          position={[0, 0.3, 1]}
          ingredientName={basketContent[1]}
          isActive={
            activeAppliance
              ? isAcceptedIngredient(
                  activeAppliance?.acceptedIngredients,
                  basketContent[1],
                  activeAppliance.specialBehaviour.includes('acceptAllIngredients')
                )
              : false
          }
        />
      )}
      {basketContent[2] !== undefined && (
        <IngredientSprite
          position={[0.6, 0.3, 0.8]}
          ingredientName={basketContent[2]}
          isActive={
            activeAppliance
              ? isAcceptedIngredient(
                  activeAppliance?.acceptedIngredients,
                  basketContent[2],
                  activeAppliance.specialBehaviour.includes('acceptAllIngredients')
                )
              : false
          }
        />
      )}
    </>
  );

  return (
    <pixiContainer isRenderGroup={true} scale={{ x: 0.3, y: 0.3 }} ref={spriteRef}>
      <pixiSprite texture={isBasketFull() ? basketFulltexture : basketEmptyTexture} anchor={0.5} />
      <BasketContentDisplay />
    </pixiContainer>
  );
};
