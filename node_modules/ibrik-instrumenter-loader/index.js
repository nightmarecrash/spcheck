'use strict';

var loaderUtils = require('loader-utils');
var _ = require('lodash');
var ibrik = require('ibrik');

module.exports = function(source) {

    var query = loaderUtils.parseQuery(this.query);
    var options = _.assign({
        embedSource: false,
        noAutoWrap: true
    }, query);

    var instrumenter = new ibrik.Instrumenter(options);

    if (this.cacheable) {
        this.cacheable();
    }

    return instrumenter.instrumentSync(source, this.resourcePath);
};
