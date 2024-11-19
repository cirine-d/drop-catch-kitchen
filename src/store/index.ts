import { create } from 'zustand';
import { Appliances, createAppliancesSlice } from './slices/appliances';
import { Basket, createBasketSlice } from './slices/basket';
import { createGameStateSlice, GameState } from './slices/gameState';

export type BoundSlices = Appliances & Basket & GameState;

export const useBoundStore = create<BoundSlices>()((...a) => ({
  ...createGameStateSlice(...a),
  ...createAppliancesSlice(...a),
  ...createBasketSlice(...a),
}));
