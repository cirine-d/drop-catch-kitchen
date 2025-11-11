import React from 'react';
import { useBoundStore } from '../store';
import { InGameMenu } from './InGameMenu';
import { LevelPicker } from './LevelPicker';
import { OrdersQueue } from './OrdersQueue';
import { StartMenu } from './StartMenu';
import { PausedMenu } from './PausedMenu';
import { GameOverMenu } from './GameOverMenu';

export const UI: React.FC = () => {
  const { gameState } = useBoundStore();

  return (
    <div id="ui">
      {gameState === 'startMenu' && <StartMenu />}
      {gameState === 'levelPicker' && <LevelPicker />}
      {gameState === 'paused' && <PausedMenu />}
      {gameState === 'gameOver' && <GameOverMenu />}
      {gameState === 'playing' && (
        <div id="inGameDashboard">
          <InGameMenu />
          <OrdersQueue />
        </div>
      )}
    </div>
  );
};
