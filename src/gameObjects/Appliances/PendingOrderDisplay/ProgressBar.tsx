import { GroupProps, Vector3 } from '@react-three/fiber';
import React, { useState, useEffect } from 'react';
import { colours } from '../../../data/constants';

interface Props extends Pick<GroupProps, 'position'> {
  cookingTime: number; // Time in seconds
}

export const ProgressBar: React.FC<Props> = props => {
  const [progress, setProgress] = useState(0);
  const [greenProgressXPos, setGreenProgressXPos] = useState(-0.5 + progress / 100);
  const [greenProgressWidth, setGreenProgressWidth] = useState((progress / 100) * 0.5);

  useEffect(() => {
    setProgress(prev => prev + 100 / props.cookingTime);

    if (props.cookingTime <= 0) {
      setProgress(100);
    }

    const greenProgressWidthDiff = (progress / 100) * 0.5 - greenProgressWidth;

    setGreenProgressXPos(prev => prev + greenProgressWidthDiff / 2);
    setGreenProgressWidth((progress / 100) * 0.5);
  }, [props.cookingTime]);

  return (
    <group position={props.position}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color={colours.GREIGE} />
      </mesh>

      <mesh position={[greenProgressXPos, 0, 0]}>
        <planeGeometry args={[greenProgressWidth, 0.1]} />
        <meshBasicMaterial color={colours.GREEN} />
      </mesh>
    </group>
  );
};
