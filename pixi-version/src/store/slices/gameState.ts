import { StateCreator } from 'zustand';
import { BoundSlices } from '..';
import { BasketDirection, GameStatus, IngredientName, Level, LevelName, Order } from '../../data/types';
import { createAppliancesMap, generateWeightedInventoryFromMenu, isIngredientTransferPossible } from '../utils';
import { levels } from '../../data/constants';
import { isAcceptedIngredient, isApplianceName } from '../../utils';
import { useTick } from '@pixi/react';

export interface GameState {
  gameState: GameStatus;
  currentLevel: Level | undefined;
  gameTimer: number;
  inventory: Map<IngredientName, number> | undefined;
  basketDirection: BasketDirection;
  setBasketDirection: (direction: BasketDirection) => void;
  startLevel: (level: LevelName) => void;
  goToLevelPicker: () => void;
  pauseGame: () => void;
  unpauseGame: () => void;
  outputIngredientsFromBasket: () => void;
  inputIngredientsToBasket: () => void;
}

export const createGameStateSlice: StateCreator<BoundSlices, [], [], GameState> = (set, get) => ({
  gameState: 'startMenu',
  currentLevel: undefined,
  gameTimer: 0,
  inventory: undefined,
  basketDirection: null,

  setBasketDirection: (direction: BasketDirection) => set({ basketDirection: direction } as any),

  startLevel: (levelName: LevelName) => {
    set({
      gameState: 'startingLevel',
      currentLevel: levels[levelName] as Level,
      gameTimer: levels[levelName].timer,
      inventory: generateWeightedInventoryFromMenu(levels[levelName].menu),
      appliances: createAppliancesMap(
        levels[levelName].menu,
        levels[levelName].extraAppliances.filter(isApplianceName)
      ),
    });

    setTimeout(() => set({ gameState: 'playing' }), 500);
    get().scheduleNextOrder();

    const interval = setInterval(() => {
      if (get().gameTimer > 0 && get().gameState === 'playing') {
        set({ gameTimer: get().gameTimer - 1 });
        get().updateOrderTimers();
      } else {
        set({ gameState: get().gameState === 'paused' ? 'paused' : 'gameOver' });
        clearInterval(interval);
        get().stopOrderScheduling();
        return;
      }
    }, 1000);
  },

  goToLevelPicker: () => {
    set({
      gameState: 'levelPicker',
    });
  },

  pauseGame: () => {
    set({ gameState: 'paused' });
  },

  unpauseGame: () => {
    set({ gameState: 'playing' });
    get().scheduleNextOrder();

    const interval = setInterval(() => {
      if (get().gameTimer > 0 && get().gameState === 'playing') {
        set({ gameTimer: get().gameTimer - 1 });
        get().updateOrderTimers();
      } else {
        set({ gameState: get().gameState === 'paused' ? 'paused' : 'gameOver' });
        clearInterval(interval);
        get().stopOrderScheduling();
        return;
      }
    }, 1000);
  },

  outputIngredientsFromBasket: () => {
    const activeAppliance = get().appliances.get(get().activeApplianceId);
    if (isIngredientTransferPossible(activeAppliance, get().basketContent)) {
      const activeApplianceCapacity = activeAppliance.contentLimit - activeAppliance.content.length;
      if (activeApplianceCapacity <= 0) {
        return;
      }

      const validIngredients = get().basketContent.filter(ingredient =>
        isAcceptedIngredient(
          activeAppliance.acceptedIngredients,
          ingredient,
          activeAppliance.specialBehaviour.includes('acceptAllIngredients')
        )
      );

      const invalidIngredients = get().basketContent.filter(
        ingredient =>
          !isAcceptedIngredient(
            activeAppliance.acceptedIngredients,
            ingredient,
            activeAppliance.specialBehaviour.includes('acceptAllIngredients')
          )
      );

      const remainingIngredients = invalidIngredients.concat(validIngredients.splice(activeApplianceCapacity));
      get().setApplianceContent(get().activeApplianceId, 'adding', validIngredients);
      get().setBasketContent('overwrite', remainingIngredients);
    }
  },

  inputIngredientsToBasket: () => {
    const activeAppliance = get().appliances.get(get().activeApplianceId);
    if (activeAppliance.specialBehaviour.includes('canOutputIngredients') && activeAppliance.content.length > 0) {
      const basketCapacity = get().basketContentLimit - get().basketContent.length;
      if (basketCapacity <= 0) {
        return;
      }

      const validIngredients = activeAppliance.content;

      const remainingIngredients = [].concat(validIngredients.splice(basketCapacity));
      get().setBasketContent('adding', validIngredients);
      get().setApplianceContent(get().activeApplianceId, 'overwrite', remainingIngredients);
    }
  },
});
