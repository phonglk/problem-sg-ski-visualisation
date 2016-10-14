import { SELECT_MAP } from '../../constants/ActionTypes.js';
import { DEFAULT_MAP } from '../../constants';

import randomMap from './randomMap';

const initialState = {
  options: [
    'default',
    'random'
  ],
  selected: 'default',
  map: DEFAULT_MAP,
};

export default function skiingMapSelection(state = initialState, action) {
  switch (action.type) {
    case SELECT_MAP: {
      const { selected } = action;
      let map = DEFAULT_MAP;
      if (selected === 'random') {
        map = randomMap();
      }

      return {
        ...state,
        selected,
        map,
      };
    }
    default:
      return state;
  }
}
