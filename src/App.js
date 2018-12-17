import React, { Component } from 'react';
import './App.css';
import CurrencyCalculator from './components/CurrencyCalculator';
import { PropTypes } from 'prop-types';
import { CHANGE_LOCALE } from './constants/languages';
import {
  ADD_CURRENCY_TO_COMPARE,
  ADD_INPUT,
  SWITCH_CURRENCIES
} from './constants/converter';
import { fetchCountriesUrl } from './constants/fetch';
import { messages } from './constants/messages';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import * as actionCreator from './reducers/actionCreator';
import ReactChartkick from 'react-chartkick';
import Chart from 'chart.js';
ReactChartkick.addAdapter(Chart);
class App extends Component {
  componentDidMount() {
    fetch(fetchCountriesUrl)
      .then(response => response.json())
      .then(result => {
        this.props.addCurrencyValue(Object.keys(result.results));
      });
  }

  render() {
    const {
      converter,
      changeLocale,
      addCurrencyValue,
      addCurrenciesToCompare,
      switchValues,
      addInputValue,
      addGraphData
    } = this.props;

    return (
      <IntlProvider
        locale={converter.locale}
        messages={messages[converter.locale]}
      >
        <CurrencyCalculator
          converter={converter}
          changeLocale={changeLocale}
          addCurrencyValue={addCurrencyValue}
          addCurrenciesToCompare={addCurrenciesToCompare}
          addInputValue={addInputValue}
          switchValues={switchValues}
          addGraphData={addGraphData}
        />
      </IntlProvider>
    );
  }
}

App.propTypes = {
  converter: PropTypes.object.isRequired,
  changeLocale: PropTypes.func.isRequired,
  addCurrencyValue: PropTypes.func.isRequired,
  switchValues: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    converter: state.currencyConvert
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeLocale: value => {
      dispatch({
        type: CHANGE_LOCALE,
        payload: value
      });
    },
    addCurrencyValue: value => {
      dispatch(actionCreator.addCurrencyValue(value));
    },
    addCurrenciesToCompare: value => {
      dispatch({
        type: ADD_CURRENCY_TO_COMPARE,
        payload: value
      });
    },
    addInputValue: value => {
      dispatch({
        type: ADD_INPUT,
        payload: value
      });
    },
    switchValues: value => {
      dispatch({
        type: SWITCH_CURRENCIES,
        payload: value
      });
    },
    addGraphData: value => {
      dispatch(actionCreator.addGraphData(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
