import { useEffect, useState, useRef, useCallback } from 'react';
import { useBoundStore } from '.';
import { GameWindowBoundaries } from '../data/types';
import { getDirectionFromKey } from '../utils';

export const useKeyboardControls = () => {
  const { setBasketDirection, setCurrentAction } = useBoundStore();
  const currentKeys = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (getDirectionFromKey(e)) {
      case 'right':
        currentKeys.current.right = true;
        setBasketDirection('right');
        break;
      case 'left':
        currentKeys.current.left = true;
        setBasketDirection('left');
        break;
      case 'up':
        currentKeys.current.up = true;
        setCurrentAction('pickUp');
        break;
      case 'down':
        currentKeys.current.down = true;
        setCurrentAction('drop');
        break;
      default:
        return;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (getDirectionFromKey(e)) {
      case 'right':
        currentKeys.current.right = false;
        if (currentKeys.current.left) {
          setBasketDirection('left');
        }
        break;
      case 'left':
        currentKeys.current.left = false;
        if (currentKeys.current.right) {
          setBasketDirection('right');
        }
        break;
      case 'up':
        currentKeys.current.up = false;
        if (!currentKeys.current.down) {
          setCurrentAction(null);
        }
        break;
      case 'down':
        currentKeys.current.down = false;
        if (!currentKeys.current.up) {
          setCurrentAction(null);
        }
        break;
      default:
        return;
    }

    if (!currentKeys.current.right && !currentKeys.current.left) {
      setBasketDirection(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setBasketDirection, handleKeyDown, handleKeyUp]);

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
