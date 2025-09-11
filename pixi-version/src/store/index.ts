import { create } from 'zustand';
import { Appliances, createAppliancesSlice } from './slices/appliances';
import { Basket, createBasketSlice } from './slices/basket';
import { createGameStateSlice, GameState } from './slices/gameState';
import { createOrdersSlice, Orders } from './slices/orders';
import { createGamePhysicsSlice, GamePhysics } from './slices/gamePhysics';

export type BoundSlices = Appliances & Basket & GameState & GamePhysics & Orders;

export const useBoundStore = create<BoundSlices>()((...a) => ({
  ...createGameStateSlice(...a),
  ...createGamePhysicsSlice(...a),
  ...createAppliancesSlice(...a),
  ...createBasketSlice(...a),
  ...createOrdersSlice(...a),
}));
