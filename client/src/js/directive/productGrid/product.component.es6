'use strict';

const ProductElement = require('../../model/productElement.model.es6');
const GridElement = require('../../model/gridElement.model.es6');

module.exports = class Product extends React.Component {

  propTypes() {
    return {
      product: React.PropTypes.instanceOf(GridElement).isRequired
    };
  }

  render() {
    if (this.prop.product instanceof ProductElement) {
      return(
        <div>
          <span>size</span>
          <span>price</span>
          <span>date</span>
        </div>
      );
    } else {
      return(
        <div>
          <span>add</span>
        </div>
      );
    }
  }
};
