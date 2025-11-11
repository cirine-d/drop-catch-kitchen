import { FC, useState, useMemo, useEffect } from 'react';
import { IngredientName } from '../data/types';
import { ingredientsDictionary } from '../data/constants';
import { Assets, ColorDodgeBlend, Texture } from 'pixi.js';

interface Props {
  position: { x: number; y: number };
  ingredientName: IngredientName;
  isActive?: boolean;
}

export const IngredientSprite: FC<Props> = props => {
  const [texture, setTexture] = useState(Texture.EMPTY);
  const highlightFilter = new ColorDodgeBlend();

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(ingredientsDictionary[props.ingredientName].picture).then(result => {
        setTexture(result);
      });
    }
  }, []);

  return (
    <pixiSprite
      texture={texture}
      anchor={props.position}
      scale={0.3}
      zIndex={9}
      filters={props.isActive ? [highlightFilter] : []}
    />
  );
};
