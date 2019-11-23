import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import best from './best';
import event from './event';
import map from './map';
import photo from './photo';
import place from './place';
import transaction from './transaction';
import trend from './trend';
import user from './user';

export default function initializeStore(initialState = {}) {
  return createStore(
    combineReducers({
      best,
      event,
      map,
      photo,
      place,
      transaction,
      trend,
      user,
    }),
    initialState,
    composeWithDevTools(applyMiddleware())
  );
}
