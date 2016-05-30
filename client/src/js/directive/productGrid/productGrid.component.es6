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
    console.log('props: ' + JSON.stringify(this.props.elements));
    if (this.props.elements) {
      const rows = [];
      const elems = [];

      this.props.elements.forEach( (element, index) => {
        elems.push(React.createElement(<Product data={element}/>));

        if (index !== 0 && index % 3 === 0) {
          rows.push(this.createRow(elems));
          elems.empty();
        }
      })

      rows.push(this.createRow(elems));
      console.log(rows);

      return (
        React.createElement('div', ...rows)
      );

    } else {
      return (undefined);
    }

  }
};
