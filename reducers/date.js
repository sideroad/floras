import moment from 'moment';

const LOAD_START = 'date/LOAD_START';
const LOAD_SUCCESS = 'date/LOAD_SUCCESS';
const LOAD_FAIL = 'date/LOAD_FAIL';
const SET_DATE = 'date/SET_DATE';

const initialState = {
  items: [],
  loaded: false,
  loading: false,
  dayOfYear: moment().dayOfYear()
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_DATE:
      return {
        ...state,
        dayOfYear: action.dayOfYear
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

export function set(dayOfYear) {
  return {
    type: SET_DATE,
    dayOfYear
  };
}
