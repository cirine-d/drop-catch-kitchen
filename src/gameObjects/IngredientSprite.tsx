import { SpriteProps, useLoader } from '@react-three/fiber';
import { IngredientName } from '../data/types';
import { TextureLoader, Vector3 } from 'three';
import { ingredientsDictionary } from '../data/constants';

interface Props extends SpriteProps {
  ingredientName: IngredientName;
}

export const IngredientSprite: React.FC<Props> = props => {
  const texture = useLoader(TextureLoader, ingredientsDictionary[props.ingredientName].picture);

  return (
    <sprite {...props} scale={0.5}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};
