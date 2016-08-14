'use strict';

const BasicGridElement = require('./basicGridElement');

module.exports = class GridElement extends React.Component {
  static get propTypes() {
    return {
      element: React.PropTypes.instanceOf(BasicGridElement).isRequired
    };
  }

  render() {
    return this.props.element.render();
  }
};
