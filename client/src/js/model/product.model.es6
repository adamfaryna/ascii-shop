'use strict';

module.exports = class ProductModel {
  constructor(id, size, price, face, date) {
    this.id = id;
    this.size = size;
    this.price = price;
    this.face = face;
    this.date = date;
  }
};
