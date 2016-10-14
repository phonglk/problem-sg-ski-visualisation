import { SELECT_MAP, NEXT_STEP } from '../../constants/ActionTypes';
import { DEFAULT_MAP, DIRECTIONS } from '../../constants';
import readMap from './readMap';
const initialState = initState(DEFAULT_MAP);

function initState(map) {
  const { stateMap, minHeight, maxHeight } = readMap(map);
  const processingStack = [0];
  return {
    currentIdx: null,
    stateMap,
    minHeight,
    maxHeight,
    processingStack,
  };
}

function findIndexOfElement(map, coord) {
  for (let i = 0; i < map.length; i++) {
    const { x, y } = map[i];
    if (x === coord.x && y === coord.y) return i;
  }
  return -1;
}

function findUnvisitedTile(stateMap) {
  for (let i = 0; i < stateMap.length; i ++) {
    if (!stateMap[i].visited) return [i];
  }
  return [];
}

function cloneTile(tile) {
  return {
    ...tile,
    nextTiles: tile.nextTiles.slice(0),
  };
}

export default function skiingMap(state = initialState, action, { skiingMapSelection }) {
  switch (action.type) {
    case SELECT_MAP:
      return initState(skiingMapSelection.map);
    case NEXT_STEP: {
      const processingStack = state.processingStack.slice(0);
      const stateMap = state.stateMap.slice(0);

      if (processingStack.length === 0) processingStack.push(...findUnvisitedTile(stateMap));
      if (processingStack.length === 0) return state;

      const currentIdx = processingStack.shift();
      const currentTile = cloneTile(stateMap[currentIdx]);
      if (!currentTile.visited) {
        currentTile.visited = true;
        DIRECTIONS.forEach(({ x, y }) => {
          const eIndex = findIndexOfElement(stateMap, {
            x: currentTile.x + x,
            y: currentTile.y + y,
          });
          if (eIndex !== -1 && currentTile.height > stateMap[eIndex].height) {
            currentTile.nextTiles.push(eIndex);
            if (!stateMap[eIndex].visited) processingStack.unshift(eIndex);
          }
        });
        stateMap[currentIdx] = currentTile;
      }

      return {
        ...state,
        processingStack,
        stateMap,
        currentIdx,
      };
    }
    default:
      return state;
  }
}
