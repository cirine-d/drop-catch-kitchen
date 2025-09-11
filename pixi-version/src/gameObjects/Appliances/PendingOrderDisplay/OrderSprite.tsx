// import { TextureLoader, Vector3 } from 'three';
// import { SpriteProps, useLoader } from '@react-three/fiber';

// interface Props extends SpriteProps {
//   orderPic: string;
//   cookingTimer?: number;
// }

// export const OrderSprite: React.FC<Props> = props => {
//   const texture = useLoader(TextureLoader, props.orderPic);
//   const glowTexture = useLoader(TextureLoader, 'assets/ingredients/glow.png');
//   const pendingOverlay = useLoader(TextureLoader, 'assets/pendingIcon.png');

//   return (
//     <>
//       {props.cookingTimer === 0 && (
//         <>
//           <sprite {...props} scale={1}>
//             <spriteMaterial map={glowTexture} />
//           </sprite>
//           <sprite {...props} scale={0.5}>
//             <spriteMaterial map={texture} />
//           </sprite>
//         </>
//       )}
//       {props.cookingTimer > 0 && (
//         <>
//           <sprite {...props} scale={0.5}>
//             <spriteMaterial map={texture} />
//           </sprite>
//           <sprite position={[0.5, 0.5, 1]} scale={0.2}>
//             <spriteMaterial map={pendingOverlay} />
//           </sprite>
//         </>
//       )}
//     </>
//   );
// };
