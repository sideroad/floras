
const LOAD_START = 'map/LOAD_START';
const LOAD_SUCCESS = 'map/LOAD_SUCCESS';
const LOAD_FAIL = 'map/LOAD_FAIL';
const UPDATE = 'map/UPDATE';
const IDLE = 'map/IDLE';

const initialState = {
  items: [],
  loaded: false,
  loading: false,
  mapViewState: {
    latitude: 35.949097014978605,
    longitude: 136.00705539354635,
    zoom: 5.2,
    pitch: 40,
    bearing: 0
  },
  idle: true,
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        mapViewState: action.mapViewState,
        idle: false,
      };
    case IDLE:
      return {
        ...state,
        idle: action.isIdle,
      };
    case LOAD_START:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.res.items
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function update(mapViewState) {
  return {
    type: UPDATE,
    mapViewState
  };
}

export function idle(isIdle) {
  return {
    type: IDLE,
    isIdle,
  };
}
