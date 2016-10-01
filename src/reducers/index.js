import { START, READ_MAP, PAUSE, NEXT_STEP, RESUME } from '../constants/ActionTypes.js';

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

function nextStep(state) {
  return {
    ...state,
    stepsCounter: state.stepsCounter + 1,
  };
}
