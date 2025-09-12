import { FC, useEffect, useState } from 'react';
import { colours } from '../../../data/constants';

interface Props {
  x: number;
  y: number;
  cookingTime: number; // time in seconds
}

export const ProgressBar: FC<Props> = ({ x, y, cookingTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 100 / (cookingTime * 60); // assuming ~60fps
        return next >= 100 ? 100 : next;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [cookingTime, progress]);

  return (
    <>
      {/* background bar */}
      <pixiGraphics
        x={x}
        y={y}
        draw={g => {
          g.clear();
          g.fill(colours.GREIGE);
          g.rect(0, 0, 100, 10); // base grey bar
          g.fill();
        }}
      />

      {/* progress fill */}
      <pixiGraphics
        x={x}
        y={y}
        draw={g => {
          g.clear();
          g.fill(colours.GREEN);
          g.rect(0, 0, (progress / 100) * 100, 10);
          g.fill();
        }}
      />
    </>
  );
};
