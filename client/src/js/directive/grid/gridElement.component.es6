'use strict';

const BasicGridElement = require('./basicGridElement.es6');

module.exports = class Product extends React.Component {
  static get propTypes() {
    return {
      element: React.PropTypes.instanceOf(BasicGridElement).isRequired
    };
  }

  render() {
    return this.props.element.render();
  }
};
