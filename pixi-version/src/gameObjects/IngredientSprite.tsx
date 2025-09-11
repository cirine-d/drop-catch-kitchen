import { FC, useState, useMemo, useEffect } from 'react';
import { IngredientName } from '../data/types';
import { ingredientsDictionary } from '../data/constants';
import { Assets, Sprite, Texture } from 'pixi.js';

interface Props {
  position: { x: number; y: number };
  ingredientName: IngredientName;
  isActive?: boolean;
}

export const IngredientSprite: FC<Props> = props => {
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [glowTexture, setGlowTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(ingredientsDictionary[props.ingredientName].picture).then(result => {
        setTexture(result);
      });
    }

    if (glowTexture === Texture.EMPTY) {
      Assets.load('assets/ingredients/glow.png').then(result => {
        setGlowTexture(result);
      });
    }
  }, []);

  return (
    <>
      {props.isActive && <pixiSprite texture={glowTexture} scale={1} position={props.position} />}
      <pixiSprite texture={texture} scale={0.5} position={props.position} />
    </>
  );
};
