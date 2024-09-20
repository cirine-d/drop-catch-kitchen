import { useCallback, useEffect, useState } from 'react';
import { Appliance, ContentUpdateMode, IngredientName, Order } from '../data/types';
import { applyContentLimitToArray, isOrderName } from '../utils';
import { useGameState } from '../GameState/GameState';
import { findPossibleOrder } from './utils';

export const useApplianceObject = (appliance: Appliance): Appliance => {
  const [content, setContent] = useState<IngredientName[]>(appliance.content);
  const [isCooking, setIsCooking] = useState<boolean>(false);
  const [pendingOrder, setPendingOrder] = useState<Order>(undefined);
  const [cookingTimer, setCookingTimer] = useState<number>(0);
  const { currentLevel } = useGameState();
  console.log(isCooking);
  useEffect(() => {
    if (!isCooking && content.length >= appliance.contentLimit) {
      const possibleOrder = findPossibleOrder(
        content,
        appliance.name,
        Array.from(currentLevel.menu.keys()).filter(isOrderName)
      );

      setContent([]);
      setIsCooking(true);
      setPendingOrder(possibleOrder);
      setCookingTimer(possibleOrder.cookingTime);
    }

    const interval = setInterval(() => {
      if (cookingTimer > 0) {
        setCookingTimer(prev => prev - 1);
      } else {
        setIsCooking(false);
      }
    }, 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [content, cookingTimer]);

  const updateContent = useCallback(
    (updateDirection: ContentUpdateMode, ingredients: IngredientName[]) => {
      if (updateDirection === 'adding') {
        const remainingCapacity = appliance.contentLimit - content.length;
        setContent(prev => [...prev, ...applyContentLimitToArray(remainingCapacity, ingredients)]);
      }

      if (updateDirection === 'overwrite') {
        setContent(ingredients);
      }
    },
    [content, appliance.contentLimit]
  );

  const collectPendingOrder = useCallback(() => {
    console.log(appliance.name, pendingOrder, isCooking, cookingTimer);
    if (pendingOrder !== undefined && !isCooking) {
      setPendingOrder(undefined);
    }
  }, [pendingOrder, isCooking, cookingTimer]);

  return {
    ...appliance,
    content,
    isCooking,
    cookingTimer: cookingTimer,
    pendingOrder,
    updateContent,
    collectPendingOrder,
  };
};
