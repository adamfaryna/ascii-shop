'use strict';

const GridElement = require('./gridElement.model.es6');

module.exports = class ProductElement extends GridElement {
  constructor(obj) {
    super(obj.id);
    this.size = obj.size;
    this.price = obj.price;
    this.face = obj.face;
    this.date = obj.date;
  }
};
