import { memo } from 'react';
import { LEVEL_Z_INDEX } from '../../data/constants';
import { Appliance } from './Appliance';
import { Appliance as IAppliance } from '../../data/types';
import { useBoundStore } from '../../store';

interface Props {
  appliances: Map<string, IAppliance>;
  boundariesRef: React.MutableRefObject<any>;
}

const AppliancesBar: React.FC<Props> = props => {
  const { appliances } = useBoundStore();
  return (
    <>
      {Array.from(props.appliances.keys()).map(key => (
        <Appliance
          key={key}
          applianceId={key}
          appliance={appliances.get(key)}
          position={[
            props.boundariesRef.current.left + 1 + Number(key.split('-')[1]) * 2,
            props.boundariesRef.current.bottom + 0.5,
            LEVEL_Z_INDEX,
          ]}
        />
      ))}
    </>
  );
};

export default memo(AppliancesBar);
