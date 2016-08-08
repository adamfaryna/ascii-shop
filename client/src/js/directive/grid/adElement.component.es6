'use strict';

const BasicGridElement = require('./basicGridElement.es6');

module.exports = class AdElement extends BasicGridElement {
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
