import { useCallback, useState } from 'react';
import { IngredientName } from '../../data/types';

export interface Basket {
  content: Partial<Record<IngredientName, number>>;
  updateContent: (ingredient: IngredientName) => void;
}

export const useBasket = (): Basket => {
  const [content, setContent] = useState<Basket['content']>({});

  const updateContent = useCallback((ingredient: IngredientName) => {
    setContent(prev => ({
      ...prev,
      [ingredient]: (prev[ingredient] || 0) + 1,
    }));
  }, []);
  return {
    updateContent,
    content,
  };
};
