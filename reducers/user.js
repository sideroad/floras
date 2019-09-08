

const SET = 'user/SET';

const initialState = {
  item: {},
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      return {
        ...state,
        item: action.item
      };
    default:
      return state;
  }
}

export function set(item) {
  return {
    type: SET,
    item
  };
}
