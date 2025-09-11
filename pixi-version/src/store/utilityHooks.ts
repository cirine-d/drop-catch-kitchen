import { useEffect, useState } from 'react';
import { useBoundStore } from '.';
import { GameWindowBoundaries } from '../data/types';
import { getDirectionFromKey } from '../utils';

export const useKeyboardControls = () => {
  const { setBasketDirection } = useBoundStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setBasketDirection(getDirectionFromKey(e));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setBasketDirection(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setBasketDirection]);

  return useBoundStore();
};

export const useGameWindowBoundaries = (): GameWindowBoundaries => {
  const [boundaries, setBoundaries] = useState(() => ({
    left: 0,
    right: window.innerWidth,
    top: 0,
    bottom: window.innerHeight,
  }));

  useEffect(() => {
    const handleResize = () => {
      setBoundaries({
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return boundaries;
};
