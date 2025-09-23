import React from 'react';
import { useBoundStore } from '../store';

export const InGameMenu: React.FC = () => {
  const { gameState, pauseGame, unpauseGame, gameTimer, profitMade } = useBoundStore();
  return (
    <div id="inGameMenu">
      {gameState === 'paused' ? (
        <button id="pauseButton" onClick={() => unpauseGame()}>
          PLAY
        </button>
      ) : (
        <button id="pauseButton" onClick={() => pauseGame()}>
          PAUSE
        </button>
      )}
      <div>{`${gameTimer} seconds left`}</div>
      <div>{`${profitMade} $$$`}</div>

      <div></div>
    </div>
  );
};
