import { useEffect, useState } from 'react';
import { Appliance, Level } from '../../data/types';
import { createAppliancesMap } from '../utils';

interface Appliances {
  appliances: Map<string, Appliance>;
}

export const useAppliances = (currentLevel: Level): Appliances => {
  const [appliances, setAppliances] = useState<Map<string, Appliance | undefined>>(new Map<string, Appliance>());

  useEffect(() => {
    if (currentLevel !== undefined) {
      const appliancesMap = createAppliancesMap(currentLevel.menu, currentLevel.isStorageEnabled);
      setAppliances(appliancesMap);
    }
  }, [currentLevel]);

  return {
    appliances,
  };
};
