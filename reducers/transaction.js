
const START = 'transaction/START';
const END = 'transaction/END';

const initialState = {
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case START:
      return {
        ...state,
        loading: true
      };
    case END:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}

export function start() {
  return {
    type: START,
  };
}

export function end() {
  return {
    type: END,
  };
}
