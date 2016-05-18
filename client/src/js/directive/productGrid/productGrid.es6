'use strict';

// const React = require('react');
// const Component = React.Component;

class DawProductGrid extends React.Component {

  shouldCreateNewRow(productIndex) {
    return productIndex % 3 === 0;
  }

  render() {
    return (
      // {this.props.products.map( (product, index) =>
        // this.shouldCreateNewRow(index) ? <div className="row"> : null

        <div className="col-xs-6">
          <daw-product product="{product}"></daw-product>
        </div>

        // ( () => this.shouldCreateNewRow(index) ? '</div>' : null)()

      // )}
    );
  }
}

module.exports = DawProductGrid;
