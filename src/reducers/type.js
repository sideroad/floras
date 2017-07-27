
const GETS_START = 'type/GETS_START';
const GETS_SUCCESS = 'type/GETS_SUCCESS';
const GETS_FAIL = 'type/GETS_FAIL';

const initialState = {
  items: {},
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
        items: action.res.body.items.reduce((items, item) =>
          ({
            ...items,
            [item.id]: {
              ...item,
              color: item.color.split(','),
              light: item.light.split(','),
            }
          }), {})
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
