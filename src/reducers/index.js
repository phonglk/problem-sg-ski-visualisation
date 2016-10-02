import { START, READ_MAP, PAUSE, NEXT_STEP, RESUME } from '../constants/ActionTypes.js';
import { DIRECTIONS } from '../constants';

const defaultSkiingMap = [
  [4, 8, 7, 3],
  [2, 5, 9, 3],
  [6, 3, 2, 5],
  [4, 4, 1, 6]
];
const initialState = {
  initialSkiingMap: defaultSkiingMap,
  skiingMap: [],
  stepsCounter: -1,
  stepInterval: 1000,
  isStarted: false,
  isNextStep: false,
  isFinished: false,

  maxPath: { length: 0, slope: 0 },
  nextIndex: 0,
  currentIndex: -1,
  processingStacks: [],
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START:
      return {
        ...state,
        isStarted: true,
        isNextStep: true,
      };
    case PAUSE:
      return {
        ...state,
        isNextStep: false,
      };
    case RESUME:
      return {
        ...state,
        isNextStep: true,
      };
    case READ_MAP:
      return readMap(state);
    case NEXT_STEP :
      return nextStep(state);
    default:
      return state;
  }
}

function readMap(state) {
  const skiingMap = [];
  let maxHeight = -Infinity;
  let minHeight = Infinity;
  state.initialSkiingMap.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val > maxHeight) maxHeight = val;
      else if (val < minHeight) minHeight = val;
      skiingMap.push({
        x,
        y,
        height: val,
        path: null,
        visited: false,
      });
    });
  });
  const updates = {
    skiingMap,
    minHeight,
    maxHeight,
  };
  return {
    ...state,
    ...updates,
    stepsCounter: 0,
  };
}

function compare(path1, path2) {
  return path1.length > path2.length ||
        (path1.length === path2.length && path1.slope > path2.slope);
}

function findIndexOfElement(map, coord) {
  for (let i = 0; i < map.length; i++) {
    const { x, y } = map[i];
    if (x === coord.x && y === coord.y) return i;
  }
  return -1;
}

function nextStep(state) {
  let { nextIndex, currentIndex } = state;
  const processingStacks = state.processingStacks.slice(0);
  const skiingMap = state.skiingMap.slice(0);

  if (processingStacks.length === 0) {
    nextIndex++;
    currentIndex = nextIndex;
  } else {
    currentIndex = processingStacks.shift();
  }
  const point = { ...skiingMap[currentIndex] };
  if (!point.visited) { // not visited
    // discover possible paths
    DIRECTIONS.forEach(({ x, y }) => {
      const eIndex = findIndexOfElement(skiingMap, {
        x: point.x + x,
        y: point.y + y,
      });
      if (eIndex !== -1 && point.height > skiingMap[eIndex].height) {
        processingStacks.unshift(eIndex);
      }
    });
    point.visited = true;
  }

  skiingMap[currentIndex] = point;
  return {
    ...state,
    skiingMap,
    nextIndex,
    currentIndex,
    processingStacks,
    stepsCounter: state.stepsCounter + 1,
  };
}
