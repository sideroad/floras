
const GETS_START = 'place/GETS_START';
const GETS_SUCCESS = 'place/GETS_SUCCESS';
const GETS_FAIL = 'place/GETS_FAIL';
const GET_START = 'place/GET_START';
const GET_SUCCESS = 'place/GET_SUCCESS';
const GET_FAIL = 'place/GET_FAIL';

const initialState = {
  item: {},
  items: [],
  loaded: false,
  loading: false,
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GETS_START:
      return {
        ...state,
      };
    case GETS_SUCCESS:
      return {
        ...state,
        items: action.body.predictions.map(prediction => ({
          id: prediction.place_id,
          name: prediction.terms.map(term => term.value).join(', '),
        })),
      };
    case GETS_FAIL:
      return {
        ...state,
        error: action.body,
      };
    case GET_START:
      return {
        ...state,
        loading: true,
      };
    case GET_SUCCESS: {
      const location = action.body.result.geometry.location;
      return {
        ...state,
        loading: false,
        loaded: true,
        item: {
          ...action.body.result,
          color: [230, 230, 230],
          radius: 5,
          position: [location.lng, location.lat, 0],
        },
      };
    }
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.body,
      };
    default:
      return state;
  }
}
