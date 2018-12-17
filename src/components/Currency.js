import React from 'react';
import { PropTypes } from 'prop-types';
class Currency extends React.Component {
  currencyPicker = e => {
    const currencyId = e.target.dataset.currency;
    this.props.addCurrency(currencyId);
    // TODO: Doesn't work without setTimeout()
    setTimeout(() => {
      this.props.getGraphData();
    }, 0);
  };

  addInput = e => {
    this.props.addValue(e.target.value);
  };

  render() {
    const { converter, input, currentCurrencyLabel } = this.props;
    return (
      <div>
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {currentCurrencyLabel}
          </button>
          <div
            onClick={this.currencyPicker}
            className="dropdown-menu"
            aria-labelledby="dropdownMenuButton"
          >
            {converter.fetched.map(currency => {
              return (
                <a
                  key={currency}
                  className="dropdown-item"
                  data-currency={currency}
                >
                  {currency}
                </a>
              );
            })}
          </div>
          <input type="number" onChange={this.addInput} value={input} />
        </div>
      </div>
    );
  }
}

Currency.propTypes = {
  converter: PropTypes.object.isRequired,
  input: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentCurrencyLabel: PropTypes.string.isRequired,
  addCurrency: PropTypes.func.isRequired,
  addValue: PropTypes.func.isRequired,
  getGraphData: PropTypes.func.isRequired
};

export default Currency;
