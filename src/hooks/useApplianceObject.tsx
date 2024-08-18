import { useCallback, useState } from 'react';
import { Appliance, ContentUpdateMode, IngredientName } from '../data/types';
import { applyContentLimitToArray } from '../utils';

export const useApplianceObject = (appliance: Appliance): Appliance => {
  const [content, setContent] = useState<IngredientName[]>(appliance.content);
  const [isCooking, setIsCooking] = useState(appliance.isCooking);

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

  return {
    ...appliance,
    content,
    isCooking,
    updateContent,
    setIsCooking,
  };
};
