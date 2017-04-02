import _ from 'lodash';
import constants from '../constants';

const GETS_START = 'best/GETS_START';
const GETS_SUCCESS = 'best/GETS_SUCCESS';
const GETS_FAIL = 'best/GETS_FAIL';

const initialState = {
  item: {},
  items: [],
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
        item: _.maxBy(action.res.body.items, item =>
          _.max(Object.keys(constants).map(type => item[type]))
        ),
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
