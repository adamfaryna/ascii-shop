'use strict';

const GridElement = require('./gridElement.component');

module.exports = class DawProductGrid extends React.Component {

  static get propTypes() {
    return {
      elements: React.PropTypes.instanceOf(Array).isRequired
    };
  }

  shouldCreateNewRow(index) {
    return index % 3 === 0;
  }

  createRow(elems) {
    return React.createElement('div', { className: 'row' }, ...elems);
  }

  render() {
    if (this.props.elements && this.props.elements.length !== 0) {
      const rows = [];
      let elems = [];

      this.props.elements.forEach( (product, index) => {
        elems.push(<GridElement element={product}/>);

        if (this.shouldCreateNewRow(index)) {
          rows.push(this.createRow(elems));
          elems = [];
        }
      })

      if (elems.length !== 0) {
        rows.push(this.createRow(elems));
      }

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
