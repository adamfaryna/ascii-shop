'use strict';

module.exports = class ProductsQueryParam {
  constructor(limit, sort, skip) {
    this.limit = limit;
    this.sort = sort;
    this.skip = skip;
  }
};
