const GETS_START = 'photo/GETS_START';
const GETS_SUCCESS = 'photo/GETS_SUCCESS';
const GETS_FAIL = 'photo/GETS_FAIL';
const SELECT = 'photo/SELECT';

const initialState = {
  items: [],
  loaded: false,
  loading: false,
  selected: {},
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.body,
      };
    case SELECT:
      return {
        ...state,
        selected: action.photo,
      };
    default:
      return state;
  }
}

export function select(photo) {
  return {
    type: SELECT,
    photo,
  };
}
