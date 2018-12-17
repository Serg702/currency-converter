import {
  ADD_CURRENCY_VALUE,
  ADD_CURRENCY_TO_COMPARE,
  SWITCH_CURRENCIES,
  ADD_INPUT
} from '../constants/converter';
import { ADD_GRAPH_DATA } from '../constants/fetch';
import { EN, CHANGE_LOCALE } from '../constants/languages';
const initialState = {
  locale: EN,
  fetched: [],
  from: {
    currency: '',
    input: ''
  },
  to: {
    currency: '',
    input: ''
  }
};

export const currencyConvert = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      state = {
        ...state,
        locale: action.payload
      };
      break;
    case ADD_CURRENCY_VALUE:
      state = {
        ...state,
        fetched: action.payload
      };
      break;
    case ADD_CURRENCY_TO_COMPARE:
      const { key } = action.payload;
      state = {
        ...state,
        [key]: {
          currency: action.payload.value,
          input: ''
        }
      };
      break;
    case SWITCH_CURRENCIES:
      state = {
        ...state,
        from: { ...state.to },
        to: { ...state.from }
      };
      break;
    case ADD_INPUT:
      const { key: inputKey } = action.payload;
      state = {
        ...state,
        [inputKey]: {
          currency: state[inputKey].currency,
          input: action.payload.value
        }
      };
      break;
    case ADD_GRAPH_DATA:
      state = {
        ...state,
        graphData: [
          {
            name: action.payload.name,
            data: action.payload.data
          }
        ]
      };
      break;
    default:
      return state;
  }
  return state;
};
