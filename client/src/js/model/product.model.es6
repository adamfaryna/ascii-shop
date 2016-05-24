'use strict';

module.exports = class Product {
  constructor(id, size, price, face, date) {
    this.id = id;
    this.size = size;
    this.price = price;
    this.face = face;
    this.date = date;
  }
};
