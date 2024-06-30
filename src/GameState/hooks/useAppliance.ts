import { useCallback, useState } from 'react';
import { Appliance, IngredientName, Level } from '../../data/types';
import { useGameState } from '../GameState';

const useApplianceObject = (applianceId: string): Appliance => {
  const [content, setContent] = useState<Partial<Record<IngredientName, number>>>({});
  const [isCooking, setCooking] = useState(false);

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
    cookingTime: 3,
    acceptedIngredients: ['apple', 'banana', 'strawberry', 'milk'],
    updateContent,
  };
};

export const useAppliance = (applianceId: string): Appliance => {
  const { appliances, updateAppliances } = useGameState();
  const appliance = useApplianceObject(applianceId);

  updateAppliances(applianceId, appliance);

  return appliances.get(applianceId);
};
