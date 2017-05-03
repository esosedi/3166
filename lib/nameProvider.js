'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _names_geonames = require('../data/names_geonames.json');

var _names_geonames2 = _interopRequireDefault(_names_geonames);

var _names_osm = require('../data/names_osm.json');

var _names_osm2 = _interopRequireDefault(_names_osm);

var _IoT = require('./IoT');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var traverse = function traverse(data, keyfn, source) {
    var result = {};
    Object.keys(data).forEach(function (iso1) {
        var country = _extends({}, data[iso1]);
        var key = keyfn(country.reference);
        if (source[key]) {
            country.names = _extends({}, country.names, source[key]);
        }
        var regions = country.regions;
        country.regions = [];
        regions.forEach(function (oldRegion) {
            var region = _extends({}, oldRegion);
            var key = keyfn(region.reference);
            if (source[key]) {
                region.names = _extends({}, region.names, source[key]);
            }
            country.regions.push(region);
        });

        result[iso1] = country;
    });
    return result;
};

var patchGeonames = function patchGeonames(dataset) {
    return traverse(dataset, function (record) {
        return record.geonames;
    }, _names_geonames2.default);
};

var patchOsm = function patchOsm(dataset) {
    return traverse(dataset, function (record) {
        return record.openstreetmap;
    }, _names_osm2.default);
};

var patch = function patch(dataset) {
    var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'wikipedia';

    if (provider == 'geonames') {
        return patchGeonames(dataset);
    }
    if (provider == 'geonames') {
        return patchOsm(dataset);
    }
    return dataset;
};

(0, _IoT.setNameProvider)(patch);

exports.default = patch;