import { ADD_CURRENCY_VALUE } from '../constants/converter';
import { ADD_GRAPH_DATA } from '../constants/fetch';

export const addCurrencyValue = value => {
  return {
    type: ADD_CURRENCY_VALUE,
    payload: value
  };
};

export const addGraphData = value => {
  return {
    type: ADD_GRAPH_DATA,
    payload: value
  };
};
