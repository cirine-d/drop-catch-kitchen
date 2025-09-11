import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { Bodies, Body, Composite, Events } from 'matter-js';
import { INGREDIENTS, ingredientsDictionary } from '../data/constants';
import { useBoundStore } from '../store';
import { Assets, Sprite, Texture } from 'pixi.js';
import { useSyncSpriteToMatter } from './utilityHooks';
import { useTick } from '@pixi/react';

interface Props {
  name: string;
  startPosition: { x: number; y: number };
}

export const Ingredient: FC<Props> = (props: Props) => {
  const { world } = useBoundStore();
  const [texture, setTexture] = useState(Texture.EMPTY);

  const physicsBody = useMemo(
    () =>
      Bodies.circle(10, 10, 20, {
        label: props.name,
        restitution: 0.75,
      }),
    []
  );

  const sprite = useMemo(
    () =>
      new Sprite({
        texture,
        anchor: 0.5,
        position: { ...props.startPosition },
        scale: { x: 0.5, y: 0.5 },
      }),
    [texture]
  );

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(ingredientsDictionary[props.name].picture).then(result => {
        setTexture(result);
      });
    }
  }, [texture]);

  useEffect(() => {
    Body.translate(physicsBody, { x: props.startPosition.x, y: props.startPosition.y });
    Composite.add(world, [physicsBody]);
  }, [physicsBody]);

  const { spriteRef, updateSprite } = useSyncSpriteToMatter(physicsBody, sprite);

  useTick(() => {
    updateSprite();
  });

  return <pixiSprite texture={texture} anchor={0.5} scale={0.2} ref={spriteRef} />;
};
