'use strict';

const ProductElement = require('../../model/productElement.model.es6');
const Product = require('./product.component.es6');

module.exports = class DawProductGrid extends React.Component {

  // static contextTypes = {
    // products: React.PropTypes.instanceOf(ProductElement).isRequired
    // columns:
  // };

  shouldCreateNewRow(index) {
    return index !== 0 && index % 3 === 0;
  }

  createRow(elems) {
    return React.createElement('div', { className: 'row' }, ...elems);
  }

  render() {
    console.log('props: ' + JSON.stringify(this.props.products));
    if (this.props.products) {
      const rows = [];
      const elems = [];

      this.props.products.forEach( (product, index) => {
        elems.push(React.createElement(<Product product={product}/>));

        if (index !== 0 && index % 3 === 0) {
          rows.push(this.createRow(elems));
          elems.empty();
        }
      })

      if (elems.length !== 0) {
        rows.push(this.createRow(elems));
      }

      console.log(rows);

      return (
        React.createElement('div', ...rows)
      );

    } else {
      return (
        React.createElement('div')
      );
    }

  }
};
