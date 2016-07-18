'use strict';

const GridElement = require('./gridElement.es6');

module.exports = class AdElement extends GridElement {
  constructor(id, data) {
    super(id)
    this.data = data;
  }

  render() {
    return(
      <div className="element ad">
        <span>Ad</span>
      </div>
    );
  }
};
