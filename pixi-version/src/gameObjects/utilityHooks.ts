import { useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';

export const useSyncSpriteToMatter = (
  body: Matter.Body,
  sprite: PIXI.Sprite,
  options?: { disableRotationSync?: boolean; positionOffset?: { x: number; y: number } }
) => {
  const spriteRef = useRef<PIXI.Sprite>(sprite);
  const bodyRef = useRef<Matter.Body>(body);

  const update = useCallback(() => {
    if (spriteRef.current && bodyRef.current) {
      spriteRef.current.position.set(bodyRef.current.position.x, bodyRef.current.position.y);
      spriteRef.current.rotation = options?.disableRotationSync ? spriteRef.current.rotation : bodyRef.current.angle;
      spriteRef.current.label = bodyRef.current.id.toString();

      // if (options?.positionOffset) {
      //   spriteRef.current.position.set(
      //     bodyRef.current.position.x + options.positionOffset.x,
      //     bodyRef.current.position.y + options.positionOffset.y
      //   );
      // }
    }
  }, [spriteRef.current, bodyRef.current]);

  return {
    spriteRef: spriteRef,
    updateSprite: update,
  };
};
