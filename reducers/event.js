import moment from 'moment';

const GETS_START = 'event/GETS_START';
const GETS_SUCCESS = 'event/GETS_SUCCESS';
const GETS_FAIL = 'event/GETS_FAIL';
const TYPES_SUCCESS = 'event/TYPES_SUCCESS';
const INITIALIZED = 'event/INITIALIZED';
const SET_DATE = 'event/SET_DATE';

const initialState = {
  types: [],
  items: [],
  initialized: false,
  loaded: false,
  loading: false,
  filtered: [],
  dayOfYear: moment().dayOfYear(),
};

const filter = (dayOfYear, items, types) =>items
  .map((event) => {
    if (Number(event.d) === dayOfYear) {
      return {
        ...event,
        id: event.i,
        name: event.n,
        color: types[event.t].color,
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
  .filter(item => item)


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
        items: action.body.items,
        filtered: filter(state.dayOfYear, action.body.items, state.types),
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case TYPES_SUCCESS:
      return {
        ...state,
        types: action.body.items.reduce(
          (items, item) => ({
            ...items,
            [item.id]: {
              ...item,
              color: item.color.split(',').map(code => Number(code)),
              light: item.light.split(',').map(code => Number(code)),
            },
          }),
          {}
        ),
      };
    case SET_DATE:
      return {
        ...state,
        types: action.types || state.types,
        dayOfYear: action.dayOfYear,
        filtered: filter(action.dayOfYear, state.items, action.types || state.types),
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
