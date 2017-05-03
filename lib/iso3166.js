'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reduce = exports.findRegionByCode = exports.findCountryByName = exports.changeNameProvider = exports.changeDispute = exports.getRegionsFor = exports.getDataSet = undefined;

require('./defaultDataset');

require('./nameProvider');

var _utils = require('./utils');

exports.getDataSet = _utils.getDataSet;
exports.getRegionsFor = _utils.getRegionsFor;
exports.changeDispute = _utils.changeDispute;
exports.changeNameProvider = _utils.changeNameProvider;
exports.findCountryByName = _utils.findCountryByName;
exports.findRegionByCode = _utils.findRegionByCode;
exports.reduce = _utils.reduce;