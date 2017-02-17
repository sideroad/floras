import items from '../data/sakura';

const GETS_START = 'event/GETS_START';
const GETS_SUCCESS = 'event/GETS_SUCCESS';
const GETS_FAIL = 'event/GETS_FAIL';

const initialState = {
  items,
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GETS_START:
      return {
        ...state,
        loading: true
      };
    case GETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.res.body.items
      };
    case GETS_FAIL:
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
