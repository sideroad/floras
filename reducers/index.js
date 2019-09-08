import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import best from './best';
import date from './date';
import event from './event';
import map from './map';
import photo from './photo';
import place from './place';
import transaction from './transaction';
import trend from './trend';
import type from './type';
import user from './user';

export function initializeStore(initialState = {}) {
  return createStore(
    combineReducers({
      best,
      date,
      event,
      map,
      photo,
      place,
      transaction,
      trend,
      type,
      user,
    }),
    initialState,
    composeWithDevTools(applyMiddleware())
  );
}
