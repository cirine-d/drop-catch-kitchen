import React from 'react';
import { levels } from '../data/constants';
import { useBoundStore } from '../store';
import { isLevelEnabled, isLevelName } from '../utils';

export const LevelPicker: React.FC = () => {
  const { startLevel, completedLevels } = useBoundStore();

  return (
    <div id="levelPicker">
      DROP CATCH KITCHEN!
      {Object.keys(levels).map(levelName => (
        <button
          key={`level-${levelName}`}
          id={`level-${levelName}`}
          onClick={() => isLevelName(levelName) && startLevel(levelName)}
          disabled={isLevelName(levelName) && !isLevelEnabled(completedLevels, levelName)}
        >
          {levelName}
        </button>
      ))}
    </div>
  );
};
