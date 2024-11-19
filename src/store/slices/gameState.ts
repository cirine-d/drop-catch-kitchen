import { StateCreator } from 'zustand';
import { BoundSlices } from '..';
import { GameStatus, IngredientName, Level, LevelName } from '../../data/types';
import { createAppliancesMap, generateWeightedInventoryFromMenu, isIngredientTransferPossible } from '../utils';
import { levels } from '../../data/constants';
import { isAcceptedIngredient } from '../../utils';

export interface GameState {
  gameState: GameStatus;
  currentLevel: Level | undefined;
  gameTimer: number;
  inventory: Map<IngredientName, number> | undefined;
  startGame: (level: LevelName) => void;
  pauseGame: () => void;
  unpauseGame: () => void;
  transferIngredientsFromBasket: () => void;
}

export const createGameStateSlice: StateCreator<BoundSlices, [], [], GameState> = (set, get) => ({
  gameState: 'startMenu',
  currentLevel: undefined,
  gameTimer: 0,
  inventory: undefined,

  startGame: (levelName: LevelName) => {
    set({
      gameState: 'startingGame',
      currentLevel: levels[levelName],
      gameTimer: levels[levelName].timer,
      inventory: generateWeightedInventoryFromMenu(levels[levelName].menu),
      appliances: createAppliancesMap(levels[levelName].menu, levels[levelName].isStorageEnabled),
    });

    setTimeout(() => set({ gameState: 'playing' }), 500);

    const interval = setInterval(() => {
      if (get().gameTimer > 0 && get().gameState === 'playing') {
        set({ gameTimer: get().gameTimer - 1 });
      } else {
        set({ gameState: get().gameState === 'paused' ? 'paused' : 'gameOver' });
        clearInterval(interval);
        return;
      }
    }, 1000);
  },

  pauseGame: () => set({ gameState: 'paused' }),

  unpauseGame: () => {
    set({ gameState: 'playing' });

    const interval = setInterval(() => {
      if (get().gameTimer > 0 && get().gameState === 'playing') {
        set({ gameTimer: get().gameTimer - 1 });
      } else {
        set({ gameState: get().gameState === 'paused' ? 'paused' : 'gameOver' });
        clearInterval(interval);
        return;
      }
    }, 1000);
  },

  transferIngredientsFromBasket: () => {
    const activeAppliance = get().appliances.get(get().activeApplianceId);
    if (isIngredientTransferPossible(activeAppliance, get().basketContent)) {
      const activeApplianceCapacity = activeAppliance.contentLimit - activeAppliance.content.length;
      if (activeApplianceCapacity <= 0) {
        return;
      }

      const validIngredients = get().basketContent.filter(ingredient =>
        isAcceptedIngredient(activeAppliance.acceptedIngredients, ingredient)
      );

      const invalidIngredients = get().basketContent.filter(
        ingredient => !isAcceptedIngredient(activeAppliance.acceptedIngredients, ingredient)
      );

      const remainingIngredients = invalidIngredients.concat(validIngredients.splice(activeApplianceCapacity));
      get().setApplianceContent(get().activeApplianceId, 'adding', validIngredients);
      get().setBasketContent('overwrite', remainingIngredients);
    }
  },
});
