import { START, READ_MAP, PAUSE, NEXT_STEP, RESUME, STOP } from '../constants/ActionTypes.js';
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
  stepInterval: 800,
  isStarted: false,
  isNextStep: false,
  isFinished: false,

  maxPath: { length: 0, slope: 0 },

  // next tile to be proccessed if processingStacks is empty 
  nextIndex: 0,

  // current processing tile
  currentIndex: -1,

  // Recursive Stacks
  processingStacks: [],

  // Track the path
  // The paths will complete when a deadend is occured 
  processingPaths: [],
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
    case STOP:
      return {
        ...state,
        ...initialState,
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
  const processingPaths = state.processingPaths.slice(0);

  if (processingStacks.length === 0) {
    currentIndex = nextIndex++;
  } else {
    currentIndex = processingStacks.shift();
  }
  const point = { ...skiingMap[currentIndex] };
  if (!point.visited) { // not visited
    // discover possible paths
    let isDeadEnd = true;
    DIRECTIONS.forEach(({ x, y }) => {
      const eIndex = findIndexOfElement(skiingMap, {
        x: point.x + x,
        y: point.y + y,
      });
      if (eIndex !== -1 && point.height > skiingMap[eIndex].height) {
        processingStacks.unshift(eIndex);
        if (isDeadEnd) isDeadEnd = false;
      }
    });
    if (isDeadEnd) {
      processingPaths.forEach((pIdx, idx) => {
        const trackingPoint = { ...skiingMap[pIdx] };
        trackingPoint.path = { length: idx + 1, slope: trackingPoint.height - point.height };
        skiingMap[pIdx] = trackingPoint;
      });
      processingPaths.splice(0, processingPaths.length);
      point.path = { length: 0, slope: 0 };
    }

    // mark visited
    point.visited = true;
    // push current point to tracking stacks
    processingPaths.unshift(currentIndex);
  }

  skiingMap[currentIndex] = point;
  return {
    ...state,
    skiingMap,
    processingPaths,
    nextIndex,
    currentIndex,
    processingStacks,
    stepsCounter: state.stepsCounter + 1,
  };
}
