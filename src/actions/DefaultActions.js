import { START, READ_MAP, NEXT_STEP, PAUSE, STOP, RESUME, SELECT_MAP } from '../constants/ActionTypes';

export function selectMap(selected) {
  return {
    type: SELECT_MAP,
    selected,
  };
}

export function readMap() {
  return {
    type: READ_MAP,
  };
}

export function startUpdateState() {
  return {
    type: START,
  };
}

export function pause() {
  return {
    type: PAUSE,
  };
}

export function resumeUpdateState() {
  return {
    type: RESUME,
  };
}

export function nextStep() {
  return {
    type: NEXT_STEP,
  };
}

export function stopUpdateState() {
  return {
    type: STOP,
  };
}

export function stop() {
  return dispatch => {
    dispatch(stopUpdateState());
    dispatch(readMap());
  };
}

export function run(isSelfCalled = false) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.skiingMap.stateMap.every(({ visited }) => visited)) {
      dispatch(pause());
    } else {
      dispatch(nextStep());
      setTimeout(() => {
        dispatch(run(true));
      }, state.stepInterval);
    }
  };
}

export function resume() {
  return dispatch => {
    dispatch(resumeUpdateState());
    dispatch(nextStep());
  };
}

export function start() {
  return dispatch => {
    dispatch(startUpdateState());
    dispatch(nextStep());
  };
}
