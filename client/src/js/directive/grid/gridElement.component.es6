'use strict';

const GridElement = require('../../view/grid/gridElement.es6');

module.exports = class Product extends React.Component {
  static get propTypes() {
    return {
      element: React.PropTypes.instanceOf(GridElement).isRequired
    };
  }

  render() {
    return this.props.element.render();
  }
};
