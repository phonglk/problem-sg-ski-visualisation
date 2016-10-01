import { START, READ_MAP, NEXT_STEP, PAUSE, RESUME } from '../constants/ActionTypes';

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

export function nextStepUpdateState() {
  return {
    type: NEXT_STEP,
  };
}

export function nextStep(isSelfCalled = false) {
  return (dispatch, getState) => {
    const state = getState();
    if (!isSelfCalled || state.isNextStep) {
      dispatch(nextStepUpdateState());
      setTimeout(() => {
        dispatch(nextStep(true));
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
    dispatch(readMap());
    dispatch(nextStep());
  };
}
