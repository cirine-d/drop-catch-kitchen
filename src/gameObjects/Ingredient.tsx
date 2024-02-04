import { ingredientsDictionary } from '../data/constants';
import { IngredientName } from '../data/types';
import { IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three';

interface Props {
  name: IngredientName;
  startPosition: THREE.Vector3;
}

export const Ingredient = (props: Props): THREE.Mesh => {
  const ingredientMesh = new Mesh(
    new IcosahedronGeometry(0.4),
    new MeshBasicMaterial({ color: ingredientsDictionary[props.name].color })
  );

  ingredientMesh.name = props.name;
  ingredientMesh.position.set(props.startPosition.x, props.startPosition.y, props.startPosition.z);
  // ingredientMesh.geometry.computeBoundingBox();

  return ingredientMesh;
};
