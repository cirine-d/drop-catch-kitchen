import { useBoundStore } from '../store';

export const StartMenu: React.FC = () => {
  const { goToLevelPicker } = useBoundStore();
  return (
    <div id="startMenu">
      DROP CATCH KITCHEN!
      <button id="playButton" onClick={goToLevelPicker}>
        PLAY
      </button>
    </div>
  );
};
