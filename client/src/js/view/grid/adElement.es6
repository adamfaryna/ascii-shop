'use strict';

const GridElement = require('./gridElement.es6');

module.exports = class AdElement extends GridElement {
  constructor(id, src) {
    super(id)
    this.src = src;
  }

  render() {
    return(
      <div className="element ad">
        <img className="ad" src={this.src}/>
      </div>
    );
  }
};
