import { useCallback, useState } from 'react';
import { ContentUpdateMode, IngredientName } from '../../data/types';
import { applyContentLimitToArray } from '../../utils';

export interface Basket {
  content: IngredientName[];
  updateContent: (updateMode: ContentUpdateMode, ingredients: IngredientName[]) => void;
}

export const useBasket = (): Basket => {
  const [content, setContent] = useState<Basket['content']>([]);
  const contentLimit = 3;

  const updateContent = useCallback(
    (updateDirection: ContentUpdateMode, ingredients: IngredientName[]) => {
      if (updateDirection === 'adding') {
        const remainingCapacity = contentLimit - content.length;
        setContent(prev => [...prev, ...applyContentLimitToArray(remainingCapacity, ingredients)]);
      }

      if (updateDirection === 'overwrite') {
        setContent(ingredients);
      }
    },
    [content, contentLimit]
  );

  return {
    updateContent,
    content,
  };
};
