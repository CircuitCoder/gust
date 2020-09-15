import * as reducers from './reducers';

import { combineReducers, createStore } from 'redux';

const root = combineReducers(reducers);

export default createStore(root);
