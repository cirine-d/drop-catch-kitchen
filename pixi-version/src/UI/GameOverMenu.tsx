import React from 'react';
import { useBoundStore } from '../store';
import { getLevelEndScore } from 'src/store/utils';
import { levels } from 'src/data/constants';
import { isLevelName } from 'src/utils';

export const GameOverMenu: React.FC = () => {
  const { profitMade, goToMainMenu, startLevel, currentLevel, stopGame } = useBoundStore();

  const endScore = getLevelEndScore(currentLevel?.profitGoal, profitMade);

  const handleMainMenu = () => {
    stopGame();
    setTimeout(() => goToMainMenu(), 100);
  };

  const handleRetry = () => {
    stopGame();
    setTimeout(() => startLevel(currentLevel.name), 100);
  };

  const handleStartNextLevel = () => {
    stopGame();
    const currentLevelIndex = Object.keys(levels).findIndex(levelName => levelName === currentLevel.name);
    const nextLevelName = Object.keys(levels)[currentLevelIndex + 1];
    if (isLevelName(nextLevelName)) {
      setTimeout(() => startLevel(nextLevelName), 100);
    } else {
      //TODO - if game end is reached show some kind of information
      setTimeout(() => goToMainMenu(), 100);
    }
  };

  return (
    <div id="startMenu">
      {endScore > 0 ? 'CONGRATULATIONS' : 'BOOHOO'}
      <br />
      Profit Made: {profitMade}
      <br />
      Score: {endScore}
      {endScore === 0 && (
        <button id="playButton" onClick={handleRetry}>
          RETRY
        </button>
      )}
      {endScore > 0 && (
        <button id="playButton" onClick={handleStartNextLevel}>
          NEXT LEVEL
        </button>
      )}
      <button id="playButton" onClick={handleMainMenu}>
        MAIN MENU
      </button>
    </div>
  );
};
