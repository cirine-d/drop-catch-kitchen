import { TextureLoader } from 'three';
import { SpriteProps, useLoader } from '@react-three/fiber';
import { IngredientName } from '../data/types';
import { ingredientsDictionary } from '../data/constants';

interface Props extends SpriteProps {
  ingredientName: IngredientName;
  isActive?: boolean;
}

export const IngredientSprite: React.FC<Props> = props => {
  const texture = useLoader(TextureLoader, ingredientsDictionary[props.ingredientName].picture);
  const glowTexture = useLoader(TextureLoader, 'assets/ingredients/glow.png');

  return (
    <>
      {props.isActive && (
        <sprite {...props} scale={1}>
          <spriteMaterial map={glowTexture} />
        </sprite>
      )}
      <sprite {...props} scale={0.5}>
        <spriteMaterial map={texture} />
      </sprite>
    </>
  );
};
