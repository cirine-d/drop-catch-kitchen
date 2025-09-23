import { StateCreator } from 'zustand';
import { Appliance, ContentUpdateMode, IngredientName, MenuItem } from '../../data/types';
import { applyContentLimitToArray } from '../../utils';
import { BoundSlices } from '..';

export interface Appliances {
  appliances: Map<string, Appliance>;
  activeApplianceId: string;
  setAppliances: (appliances: Map<string, Appliance>) => void;
  setActiveAppliance: (applianceId: string) => void;
  setApplianceContent?: (applianceId: string, updateMode: ContentUpdateMode, ingredients: IngredientName[]) => void;
  startCooking?: (applianceId: string, possibleOrder: MenuItem) => void;
  collectPendingMenuItem?: (applianceId: string) => void;
}

export const createAppliancesSlice: StateCreator<BoundSlices, [], [], Appliances> = (set, get) => ({
  appliances: new Map<string, Appliance>(),
  activeApplianceId: undefined,

  setAppliances: (appliances: Map<string, Appliance>) => set({ appliances }),

  setActiveAppliance: (applianceId: string) =>
    set(state => {
      const newAppliances = new Map(state.appliances);
      const appliance = newAppliances.get(applianceId);

      if (appliance) {
        appliance.isActive = true;
      }

      return { appliances: newAppliances, activeApplianceId: applianceId };
    }),

  setApplianceContent: (applianceId: string, updateMode: ContentUpdateMode, ingredients: IngredientName[]) =>
    set(state => {
      const newAppliances = new Map(state.appliances);
      const appliance = newAppliances.get(applianceId);

      if (appliance && updateMode === 'adding') {
        const remainingCapacity = appliance.contentLimit - appliance.content.length;
        appliance.content = [...appliance.content, ...applyContentLimitToArray(remainingCapacity, ingredients)];
      }

      if (appliance && updateMode === 'overwrite') {
        appliance.content = ingredients;
      }
      return { appliances: newAppliances };
    }),

  startCooking: (applianceId: string, possibleOrder: MenuItem) =>
    set(state => {
      const newAppliances = new Map(state.appliances);
      const appliance = newAppliances.get(applianceId);

      if (appliance) {
        appliance.content = [];
        appliance.pendingMenuItem = possibleOrder;
        appliance.cookingTimer = possibleOrder.cookingTime;
      }

      const interval = setInterval(() => {
        if (appliance.cookingTimer > 0) {
          appliance.cookingTimer -= 1;
        } else {
          clearInterval(interval);
          return state;
        }
      }, 1000);
      return { appliances: newAppliances };
    }),

  collectPendingMenuItem: (applianceId: string) =>
    set(state => {
      const newAppliances = new Map(state.appliances);
      const appliance = newAppliances.get(applianceId);

      if (appliance.pendingMenuItem !== undefined && appliance.cookingTimer === 0) {
        get().tryMatchMenuItemToPendingOrders(appliance.pendingMenuItem.name);
        appliance.pendingMenuItem = undefined;
      }
      return { appliances: newAppliances };
    }),
});
