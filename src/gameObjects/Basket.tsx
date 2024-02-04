import * as THREE from 'three';
import { BasketDirection } from '../data/types';
import { colours } from '../data/constants';
import { getDirectionFromKey } from '../utils';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

interface Props {
  startPosition?: THREE.Vector3;
  gamePanelBoundaries?: {
    right: number;
    left: number;
  };
}

export const Basket: React.VFC = (props: Props) => {
  // const ref = useRef<THREE.Mesh>();
  // const [contents, setContents] = useState<HashMap<number>>({});
  // const [contentIds, setContentIds] = useState<number[]>([]);

  // const addIngredient = (ingredient: IIngredient) => {
  //   const newContentIds = [...contentIds];
  //   if (contentIds.includes(ingredient.object.id)) {
  //     return;
  //   }

  //   if (contents[ingredient.name]) {
  //     contents[ingredient.name] += 1;
  //   } else {
  //     contents[ingredient.name] = 1;
  //   }

  //   setContentIds([...newContentIds, ingredient.object.id]);
  // };

  React.useEffect(() => {});

  const moveBasket = (direction: BasketDirection) => {
    if (direction === 'left' && basketMesh.position.x > props.gamePanelBoundaries.left) {
      basketMesh.position.x -= 0.3;
    }
    if (direction === 'right' && basketMesh.position.x < props.gamePanelBoundaries.right) {
      basketMesh.position.x += 0.3;
    }
  };

  const basketMesh = new Mesh(new BoxGeometry(1, 0.7, 0.8), new MeshBasicMaterial({ color: colours.BROWN }));

  props.startPosition && basketMesh.position.set(props.startPosition.x, props.startPosition.y, props.startPosition.z);
  // ref.current.geometry.computeBoundingBox();

  document.addEventListener('keydown', event => moveBasket(getDirectionFromKey(event)), false);

  return (
    <mesh ref={basketRef} position={startPosition ? [startPosition.x, startPosition.y, startPosition.z] : [0, 0, 0]}>
      <boxGeometry args={[1, 0.7, 0.8]} />
      <meshBasicMaterial color={colours.BROWN} />
    </mesh>
  );
};
