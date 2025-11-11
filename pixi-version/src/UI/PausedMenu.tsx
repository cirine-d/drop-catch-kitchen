import React from 'react';
import { useBoundStore } from '../store';

export const PausedMenu: React.FC = () => {
  const { goToLevelPicker, unpauseGame, stopGame } = useBoundStore();

  const handleQuitLevel = () => {
    stopGame();
    goToLevelPicker();
  };

  return (
    <div id="startMenu">
      DROP CATCH KITCHEN!
      <button id="playButton" onClick={unpauseGame}>
        RESUME
      </button>
      <button id="playButton" onClick={handleQuitLevel}>
        QUIT
      </button>
    </div>
  );
};
