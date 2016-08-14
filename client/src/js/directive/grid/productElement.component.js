'use strict';

const BasicGridElement = require('./basicGridElement');
const currencyFilter = angular.injector(['ng']).get('$filter')('currency');

module.exports = class ProductElement extends BasicGridElement {
  constructor(obj) {
    super(obj.id);
    this.size = obj.size;
    this.price = currencyFilter(obj.price);
    this.face = obj.face;
    this.date = moment(obj.date).fromNow();
  }

  render() {
    return(
      <div className="element product">
        <div className="face">
          <span style={{fontSize: this.size + "px"}}>{this.face}</span>
        </div>
        <div className="size">
          <span>size: {this.size}</span>
        </div>
        <div className="price">
          <span>price: {this.price}$</span>
        </div>
        <div className="date">
          <span>date added: {this.date}</span>
        </div>
      </div>
    );
  }
};
