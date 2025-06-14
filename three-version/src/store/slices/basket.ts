import { StateCreator } from 'zustand';
import { ContentUpdateMode, IngredientName } from '../../data/types';
import { BoundSlices } from '..';
import { applyContentLimitToArray } from '../../utils';

export interface Basket {
  basketContent: IngredientName[];
  basketContentLimit: number;
  isBasketFull: () => boolean;
  setBasketContent: (updateMode: ContentUpdateMode, ingredients: IngredientName[]) => void;
}

export const createBasketSlice: StateCreator<BoundSlices, [], [], Basket> = (set, get) => ({
  basketContent: [],
  basketContentLimit: 3,
  isBasketFull: () => get().basketContent.length >= get().basketContentLimit,

  setBasketContent: (updateMode: ContentUpdateMode, ingredients: IngredientName[]) => {
    set(state => {
      if (updateMode === 'adding') {
        const remainingCapacity = state.basketContentLimit - state.basketContent.length;
        return { basketContent: [...state.basketContent, ...applyContentLimitToArray(remainingCapacity, ingredients)] };
      }

      if (updateMode === 'overwrite') {
        return { basketContent: ingredients };
      }
    });
  },
});
