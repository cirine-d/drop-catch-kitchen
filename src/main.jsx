import { createRoot } from 'react-dom/client';
import App from './App';
import { GameStateProvider } from './GameState/GameState';

createRoot(document.getElementById('main')).render(
  <GameStateProvider>
    <App />
  </GameStateProvider>
);
