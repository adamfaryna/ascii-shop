'use strict';

const ProductModel = require('../../model/product.model.es6');

module.exports = class Product extends React.Component {

  propTypes() {
    return {
      product: React.PropTypes.instanceOf(ProductModel).isRequired
    };
  }

  render() {
    return(
      <div>
        <span>size</span>
        <span>price</span>
        <span>date</span>
      </div>
    );
  }
};
