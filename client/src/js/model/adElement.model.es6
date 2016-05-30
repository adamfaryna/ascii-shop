'use strict';

const GridElement = require('./gridElement.model.es6');

module.exports = class AdElement extends GridElement {
  constructor(id, data) {
    super(id)
    this.data = data;
  }
};
