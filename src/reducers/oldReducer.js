import { combineReducers } from 'redux';

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
  stepInterval: 400,
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

  // store path
  paths: [],
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
        isDeadEnd: false,
        paths: [],
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

function checkMaxPath(path, maxPath) {
  return (path.length > maxPath.length ||
        (path.length === maxPath.length && path.slop > maxPath.slope))
        ? path : maxPath;
}

function nextStep(state) {
  let { nextIndex, currentIndex } = state;
  let maxPath = { ...state.maxPath };
  const paths = state.paths.slice(0); 
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

    processingPaths.push(currentIndex);
    if (isDeadEnd) {
      processingPaths.slice(0).reverse().forEach((pIdx, idx) => {
        // console.log(pIdx, currentIndex);
        const trackingPoint = pIdx === currentIndex ? point : { ...skiingMap[pIdx] };
        trackingPoint.path = { length: idx, slope: trackingPoint.height - point.height };
        trackingPoint.paths = processingPaths.slice(0, idx - 1);
        maxPath = checkMaxPath(trackingPoint.path, maxPath);
        skiingMap[pIdx] = trackingPoint;
      });

      if (processingPaths.length > 1) {
        paths.push(processingPaths.slice(0));
      }

      processingPaths.splice(0, processingPaths.length);
      point.isDeadEnd = true;
    }

    // mark visited
    point.visited = true;
    // push current point to tracking stacks
  } else {
    // processingPaths.push(currentIndex);
    // processingPaths.slice(0).reverse().forEach((pIdx, idx) => {
    //   const trackingPoint = { ...skiingMap[pIdx] };
    //   trackingPoint.path = { 
    //     length: idx + point.path.length, 
    //     slope: trackingPoint.height - point.height + point.path.slope
    //   };
    //   // console.log(processingPaths.slice(0), idx, processingPaths.slice(0, idx).slice(0))
    //   trackingPoint.paths = processingPaths.slice(0, idx - 1).concat(point.paths);
    //   maxPath = checkMaxPath(trackingPoint.path, maxPath);
    //   skiingMap[pIdx] = trackingPoint;
    // });

    // paths.push(processingPaths.concat(point.paths));

    // processingPaths.splice(0, processingPaths.length);
  }

  skiingMap[currentIndex] = point;
  return {
    ...state,
    maxPath,
    paths,
    skiingMap,
    processingPaths,
    nextIndex,
    currentIndex,
    processingStacks,
    stepsCounter: state.stepsCounter + 1,
  };
}
