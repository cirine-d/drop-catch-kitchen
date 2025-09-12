import * as React from 'react';
import { memo } from 'react';
import { Appliance } from './Appliance';
import { Appliance as IAppliance } from '../../data/types';
import { useBoundStore } from '../../store';
import { useGameWindowBoundaries } from '../../store/utilityHooks';

interface Props {
  appliances: Map<string, IAppliance>;
  boundariesRef: React.MutableRefObject<any>;
}

const AppliancesBar: React.FC<Props> = props => {
  const { appliances } = useBoundStore();
  const { bottom, left } = useGameWindowBoundaries();
  return (
    <>
      {Array.from(props.appliances.keys()).map(key => (
        <Appliance
          key={key}
          applianceId={key}
          appliance={appliances.get(key)}
          position={{
            x: left + 150 + Number(key.split('-')[1]) * 300,
            y: bottom - 130,
          }}
        />
      ))}
    </>
  );
};

export default memo(AppliancesBar);
