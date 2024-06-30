import { Appliance as IAppliance, ApplianceName } from '../../data/types';
import { memo } from 'react';
import { LEVEL_Z_INDEX } from '../../data/constants';
import { Appliance } from './Appliance';

interface Props {
  appliances: Map<string, IAppliance | undefined>;
  boundariesRef: React.MutableRefObject<any>;
}

const AppliancesBar: React.FC<Props> = props => (
  <>
    {Array.from(props.appliances.keys()).map(key => (
      <Appliance
        key={key}
        applianceId={key}
        position={[
          props.boundariesRef.current.left + 1 + Number(key.split('-')[1]) * 2,
          props.boundariesRef.current.bottom,
          LEVEL_Z_INDEX,
        ]}
      />
    ))}
  </>
);

export default memo(AppliancesBar);
