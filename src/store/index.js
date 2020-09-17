import * as reducers from './reducers';

import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const root = combineReducers(reducers);

export default createStore(
  root,
  compose(applyMiddleware(thunk), applyMiddleware(createLogger())),
);
