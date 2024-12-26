import { levels } from '../data/constants';
import { useBoundStore } from '../store';
import { isLevelName } from '../utils';

export const LevelPicker: React.FC = () => {
  const { startLevel } = useBoundStore();

  return (
    <div id="levelPicker">
      DROP CATCH KITCHEN!
      {Object.keys(levels).map(levelName => (
        <button
          key={`level-${levelName}`}
          id={`level-${levelName}`}
          onClick={() => isLevelName(levelName) && startLevel(levelName)}
        >
          {levelName}
        </button>
      ))}
    </div>
  );
};
