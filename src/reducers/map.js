
const LOAD_START = 'map/LOAD_START';
const LOAD_SUCCESS = 'map/LOAD_SUCCESS';
const LOAD_FAIL = 'map/LOAD_FAIL';
const UPDATE_MAP = 'map/UPDATE_MAP';

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
  }
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_MAP:
      return {
        ...state,
        mapViewState: action.mapViewState
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
    type: UPDATE_MAP,
    mapViewState
  };
}
