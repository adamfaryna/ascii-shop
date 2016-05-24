'use strict';

// const React = require('react');
// const Component = React.Component;

const Product = require('../model/product.model.es6');

module.exports = class DawProductGrid extends React.Component {

  static contextTypes() {
    return {
      products: React.PropTypes.instanceOf(Product).isRequired
    }
  }

  shouldCreateNewRow(productIndex) {
    return productIndex % 3 === 0;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this._container);
  }

  render() {
    const products = [];
    let loopIndex;
    let loopProduct;


    return (
      <div>
      {this.props.products.map( (product, index) => {
        loopProduct = product;
        loopIndex = index;
      })}

      {this.shouldCreateNewRow(loopIndex) ? <div className="row"> : null}

        <div className="col-xs-6">
          <daw-product product="{loopProduct}"></daw-product>
        </div>

        {( () => this.shouldCreateNewRow(loopIndex) ? '</div>' : null)() }

      </div>
      );
  }
};
