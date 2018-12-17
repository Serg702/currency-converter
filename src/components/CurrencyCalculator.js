import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';
import { EN, RU } from '../constants/languages';
import Currency from './Currency';
import fetch from '../transport/fetch';
import {
  currencyConverterEndpoint,
  defaultNumberOfHistoryDays
} from '../constants/fetch';
import { LineChart } from 'react-chartkick';
class CurrencyCalculator extends React.Component {
  state = {
    noLabel: false,
    amountOfDays: false,
    catch: [],
    currencyHistory: defaultNumberOfHistoryDays
  };

  convertCurrencies = () => {
    const { from, to } = this.props.converter;
    if (from.currency && to.currency) {
      this.setState({ noLabel: false });
      const valuesToCompare = `${from.currency}_${to.currency}`;
      const url = `${currencyConverterEndpoint}?q=${valuesToCompare}&compact=y`;
      fetch(url)
        .then(response => response.json())
        .then(result => {
          const convertedValue = Object.values(result)[0].val * from.input;

          this.addTo(convertedValue);
        })
        .catch(error => this.setState({ catch: [...this.state.catch, error] }));
    } else {
      this.setState({ noLabel: true });
    }
  };

  getDate = daysCount => {
    const todaysDate = new Date();

    if (daysCount) {
      // Finding out what was the date 8 days ago
      todaysDate.setDate(todaysDate.getDate() - daysCount);
      const pastDate = todaysDate.toLocaleString();
      const newDate = pastDate
        .substring(0, pastDate.indexOf(','))
        .split('/')
        .reverse();
      const lastElem = newDate.splice(1, 1);
      newDate.push(lastElem);
      return newDate.join('-');
    }

    let dd = todaysDate.getDay();
    let mm = todaysDate.getMonth() + 1;
    const yyyy = todaysDate.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    return `${yyyy}-${mm}-${dd}`;
  };

  getGraphData = () => {
    const { from, to } = this.props.converter;
    if (from.currency && to.currency) {
      const todaysDate = this.getDate();
      const pastDate = this.getDate(this.state.currencyHistory);
      const valuesToCompare = `${from.currency}_${to.currency}`;
      const graphUrl = `${currencyConverterEndpoint}?q=${valuesToCompare}&compact=ultra&date=${pastDate}&endDate=${todaysDate}`;
      fetch(graphUrl)
        .then(response => response.json())
        .then(result => {
          const data = Object.entries(result);
          this.props.addGraphData({
            name: data[0][0],
            data: data[0][1]
          });
        })
        .catch(error => this.setState({ catch: [...this.state.catch, error] }));
    }
  };

  addCurrency = (currencyId, key) => {
    this.props.addCurrenciesToCompare({
      key: key,
      value: currencyId
    });
  };

  addInput = (inputKey, key) => {
    this.props.addInputValue({
      key: key,
      value: inputKey
    });
  };

  addFromCurrency = currencyId => {
    this.addCurrency(currencyId, 'from');
  };

  addToCurrency = currencyId => {
    this.addCurrency(currencyId, 'to');
  };

  addFrom = inputValue => {
    this.addInput(inputValue, 'from');
  };

  addTo = inputValue => {
    this.addInput(inputValue, 'to');
  };

  addCurrencyHistory = e => {
    this.setState({
      ...this.state,
      currencyHistory: e.target.value
    });
  };

  reverseValues = () => {
    const {
      converter: { from, to },
      switchValues
    } = this.props;

    if (from.currency && to.currency) {
      switchValues();
      setTimeout(() => {
        this.getGraphData();
      }, 0);
    }
  };

  render() {
    const { converter, changeLocale } = this.props;
    return (
      <div className="App">
        <h1>
          <FormattedMessage id="exchange.rates" />
        </h1>

        <div>
          <button type="button" onClick={() => changeLocale(EN)}>
            {EN}
          </button>
          <button type="button" onClick={() => changeLocale(RU)}>
            {RU}
          </button>
        </div>
        <div className="currency">
          <Currency
            converter={converter}
            addCurrency={this.addFromCurrency}
            currentCurrencyLabel={converter.from.currency}
            input={converter.from.input}
            addValue={this.addFrom}
            getGraphData={this.getGraphData}
          />
          <button type="button" onClick={this.reverseValues}>
            <FormattedMessage id="switch" />
          </button>
          <button type="button" onClick={this.convertCurrencies}>
            <FormattedMessage id="convert" />
          </button>
          <Currency
            converter={converter}
            addCurrency={this.addToCurrency}
            currentCurrencyLabel={converter.to.currency}
            input={converter.to.input}
            addValue={this.addTo}
            getGraphData={this.getGraphData}
          />
        </div>
        <div />
        <div className="input">
          <h6>
            <FormattedMessage id="daysBack" />
          </h6>
          <input
            onChange={this.addCurrencyHistory}
            value={this.state.currencyHistory}
          />
        </div>
        <div>
          {this.state.noLabel && (
            <h1>
              <FormattedMessage id="nolabel" />
            </h1>
          )}
        </div>
        <div>
          <button onClick={this.getGraphData}>
            <FormattedMessage id="showGraph" />
          </button>
          <div>
            {this.state.amountOfDays && (
              <h2>
                <FormattedMessage id="amountOfDays" />
              </h2>
            )}
          </div>
        </div>
        {converter.graphData && (
          <LineChart colors={['#b10', '#666']} data={converter.graphData} />
        )}
        {this.state.catch !== undefined && this.state.catch.join(',')}
      </div>
    );
  }
}

CurrencyCalculator.propTypes = {
  converter: PropTypes.object.isRequired,
  changeLocale: PropTypes.func.isRequired,
  addCurrencyValue: PropTypes.func.isRequired,
  addCurrenciesToCompare: PropTypes.func.isRequired,
  addInputValue: PropTypes.func.isRequired,
  addGraphData: PropTypes.func.isRequired
};

export default CurrencyCalculator;
