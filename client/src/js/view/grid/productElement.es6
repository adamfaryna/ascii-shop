'use strict';

const GridElement = require('./gridElement.es6');
require('react-datetime');

module.exports = class ProductElement extends GridElement {
  constructor(obj) {
    super(obj.id);
    this.size = obj.size;
    this.price = obj.price;
    this.face = obj.face;
    this.date = obj.date;
  }

  render() {
    return(
      <div className="element product">
        <div className="face">
          <span>{this.face}</span>
        </div>
        <div className="size">
          <span>size: {this.size}</span>
        </div>
        <div className="price">
          <span>price: {this.price}</span>
        </div>
        <div className="date">
          <span>date added: {moment(this.date).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </div>
      </div>
    );
  }
};
