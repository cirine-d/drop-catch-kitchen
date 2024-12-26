import { useBoundStore } from '../store';
import { InGameMenu } from './InGameMenu';
import { LevelPicker } from './LevelPicker';
import { OrdersQueue } from './OrdersQueue';
import { StartMenu } from './StartMenu';

export const UI: React.FC = () => {
  const { gameState } = useBoundStore();

  return (
    <div id="ui">
      {gameState === 'startMenu' && <StartMenu />}
      {gameState === 'levelPicker' && <LevelPicker />}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div id="inGameDashboard">
          <InGameMenu />
          <OrdersQueue />
        </div>
      )}
    </div>
  );
};
