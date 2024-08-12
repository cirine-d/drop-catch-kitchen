import { useCallback, useState } from 'react';
import { Appliance, IngredientName } from '../data/types';

export const useApplianceObject = (appliance: Appliance): Appliance => {
  const [content, setContent] = useState<Partial<Record<IngredientName, number>>>(appliance.content);
  const [isCooking, setIsCooking] = useState(appliance.isCooking);

  const updateContent = useCallback((ingredients: IngredientName[]) => {
    ingredients.forEach(ingredient => {
      setContent(prev => ({
        ...prev,
        [ingredient]: (prev[ingredient] || 0) + 1,
      }));
    });
  }, []);

  return {
    content,
    isCooking,
    cookingTime: appliance.cookingTime,
    acceptedIngredients: appliance.acceptedIngredients,
    updateContent,
    setIsCooking,
  };
};
