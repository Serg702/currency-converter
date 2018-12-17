import { createStore, applyMiddleware, combineReducers } from 'redux';
import { currencyConvert } from '../reducers/currencyConvert';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

let middleware = thunk;
if (typeof window !== 'undefined') {
  middleware = (middleware, logger);
}
export const store = createStore(
  combineReducers({ currencyConvert }),
  applyMiddleware(middleware)
);
