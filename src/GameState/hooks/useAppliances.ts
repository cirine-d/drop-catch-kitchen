import { useEffect, useState } from 'react';
import { Appliance, Level } from '../../data/types';
import { createAppliancesMap } from '../utils';

export interface Appliances {
  appliances: Map<string, Appliance>;
  activeAppliance: Appliance;
  setActiveAppliance: (appliance: Appliance | undefined) => void;
}

export const useAppliances = (currentLevel: Level): Appliances => {
  const [appliances, setAppliances] = useState<Map<string, Appliance>>(new Map<string, Appliance>());
  const [activeAppliance, setActiveAppliance] = useState<Appliance | undefined>(undefined);

  useEffect(() => {
    if (currentLevel !== undefined) {
      const appliancesMap = createAppliancesMap(currentLevel.menu, currentLevel.isStorageEnabled);
      setAppliances(appliancesMap);
    }
  }, [currentLevel]);

  return {
    appliances,
    activeAppliance,
    setActiveAppliance,
  };
};
