import { default as skiingMapSelectionReducer } from './skiingMapSelection';
import { default as skiingMapReducer } from './skiingMap';

export default function rootReducer(state = {} , action) {
  const skiingMapSelection = skiingMapSelectionReducer(state.skiingMapSelection, action);
  const skiingMap = skiingMapReducer(state.skiingMap, action, { skiingMapSelection });
  return {
    stepInterval: 100,
    isRunning: false,
    skiingMapSelection,
    skiingMap,
  };
}
