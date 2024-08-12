import { useEffect, useState } from 'react';
import { Appliance, Level } from '../../data/types';
import { createAppliancesMap } from '../utils';

interface Appliances {
  appliances: Map<string, Appliance>;
  activeAppliance: string;
  setActiveAppliance: (applianceId: string | undefined) => void;
}

export const useAppliances = (currentLevel: Level): Appliances => {
  const [appliances, setAppliances] = useState<Map<string, Appliance>>(new Map<string, Appliance>());
  const [activeAppliance, setActiveAppliance] = useState<string | undefined>(undefined);

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
