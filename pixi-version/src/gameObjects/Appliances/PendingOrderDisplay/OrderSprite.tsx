import { FC, useState, useEffect } from 'react';
import { Assets, ColorDodgeBlend, Texture } from 'pixi.js';

interface Props {
  orderPic: string;
  cookingTimer?: number;
}

export const OrderSprite: FC<Props> = props => {
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [glowTexture, setGlowTexture] = useState(Texture.EMPTY);
  const [pendingOverlay, setPendingOverlay] = useState(Texture.EMPTY);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(props.orderPic).then(result => {
        setTexture(result);
      });
    }

    if (glowTexture === Texture.EMPTY) {
      Assets.load('assets/ingredients/glow.png').then(result => {
        setGlowTexture(result);
      });
    }

    if (pendingOverlay === Texture.EMPTY) {
      Assets.load('assets/ingredients/pendingIcon.png').then(result => {
        setPendingOverlay(result);
      });
    }
  }, []);

  return (
    <>
      {props.cookingTimer === 0 && (
        <>
          <pixiSprite texture={glowTexture} anchor={0.5} scale={0.3} zIndex={10} />
          <pixiSprite texture={texture} anchor={0.5} scale={0.3} zIndex={9} />
        </>
      )}
      {props.cookingTimer > 0 && (
        <>
          <pixiSprite texture={pendingOverlay} anchor={props.position} scale={0.3} zIndex={9} />
          <pixiSprite texture={texture} anchor={0.5} scale={0.3} zIndex={9} />
        </>
      )}
    </>
  );
};
