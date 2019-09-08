const GETS_START = 'event/GETS_START';
const GETS_SUCCESS = 'event/GETS_SUCCESS';
const GETS_FAIL = 'event/GETS_FAIL';
const INITIALIZED = 'event/INITIALIZED';
const SET_DATE = 'event/SET_DATE';

const initialState = {
  items: [],
  initialized: false,
  loaded: false,
  loading: false,
  filtered: [],
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INITIALIZED:
      return {
        ...state,
        initialized: true,
      };
    case GETS_START:
      return {
        ...state,
        loading: true,
      };
    case GETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.res.body.items,
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case SET_DATE:
      return {
        ...state,
        filtered: state.items
          .map((event) => {
            if (Number(event.d) === action.dayOfYear) {
              return {
                ...event,
                id: event.i,
                name: event.n,
                color: action.types[event.t].color,
                radius: event.s,
                position: event.l
                  .split(',')
                  .map(item => Number(item))
                  .reverse()
                  .concat([0]),
              };
            }
            return undefined;
          })
          .filter(item => item),
      };
    default:
      return state;
  }
}

export function setDate({ types, dayOfYear }) {
  return {
    type: SET_DATE,
    types,
    dayOfYear,
  };
}

export function initialized(gl) {
  console.log('initialized', gl);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  return {
    type: INITIALIZED,
  };
}
