import { FC } from 'react';
import { Assets, BlurFilter, ColorDodgeBlend, Sprite, Texture } from 'pixi.js';
import { Bodies, Body, Composite, Events } from 'matter-js';
import { APPLIANCES, BASKET_SENSOR, appliancesDictionary } from '../../data/constants';
import { getApplianceNameFromId } from '../../utils';
import { Appliance as IAppliance } from '../../data/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IngredientSprite } from '../IngredientSprite';
import { PendingOrderDisplay } from './PendingOrderDisplay';
import { useBoundStore } from '../../store';
import { findPossibleOrder } from '../../store/utils';

interface Props {
  position: { x: number; y: number };
  applianceId: string;
  appliance: IAppliance;
}

export const Appliance: FC<Props> = props => {
  const { engine, physicsWorld, appliances, setActiveAppliance, startCooking, currentLevel } = useBoundStore();
  const appliance = useMemo(() => appliances.get(props.applianceId), [appliances, props.applianceId]);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const activeOverlaps = useRef(0);

  const physicsBody = useMemo(
    () =>
      Bodies.rectangle(0, 50, 100, 300, {
        label: props.applianceId,
        isStatic: true,
        isSensor: true,
      }),
    []
  );

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(appliancesDictionary[getApplianceNameFromId(props.applianceId)].picture).then(result => {
        setTexture(result);
      });
    }
  }, [texture]);

  useEffect(() => {
    Body.translate(physicsBody, { x: props.position.x, y: props.position.y });
    Composite.add(physicsWorld, [physicsBody]);
  }, [physicsBody]);

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

  Events.on(engine, 'collisionStart', event => {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;

      if (
        (bodyA.label === props.applianceId && bodyB.label === 'basketApplianceSensor') ||
        (bodyA.label === 'basketApplianceSensor' && bodyB.label === props.applianceId)
      ) {
        handleIntersectionEnter();
      }
    }
  });

  Events.on(engine, 'collisionEnd', event => {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;

      if (
        (bodyA.label === props.applianceId && bodyB.label === 'basketApplianceSensor') ||
        (bodyA.label === 'basketApplianceSensor' && bodyB.label === props.applianceId)
      ) {
        handleIntersectionExit();
      }
    }
  });

  const highlightFilter = new ColorDodgeBlend();

  return (
    <pixiContainer zIndex={2} scale={{ x: 0.4, y: 0.4 }} position={{ x: props.position.x, y: props.position.y }}>
      <pixiSprite texture={texture} anchor={{ x: 0.5, y: 0.4 }} filters={isHighlighted ? [highlightFilter] : []} />
      {appliance.content.length > 0 && (
        <>
          {appliance.content[0] !== undefined && (
            <IngredientSprite position={{ x: 0, y: -0.3 }} ingredientName={appliance.content[0]} />
          )}
          {appliance.content[1] !== undefined && (
            <IngredientSprite position={{ x: 0.5, y: -0.3 }} ingredientName={appliance.content[1]} />
          )}
          {appliance.content[2] !== undefined && (
            <IngredientSprite position={{ x: 1, y: -0.3 }} ingredientName={appliance.content[2]} />
          )}
        </>
      )}
      {appliance.pendingMenuItem !== undefined && (
        <PendingOrderDisplay
          applianceId={props.applianceId}
          orderPic={appliance.pendingMenuItem.picture}
          cookingTimer={appliance.cookingTimer}
        />
      )}
    </pixiContainer>
  );
};
