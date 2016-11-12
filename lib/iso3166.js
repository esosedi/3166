'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findRegionByCode = exports.findCountryByName = exports.changeDispute = exports.getRegionsFor = exports.getDataSet = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _iso = require('../data/iso3166-2.json');

var _iso2 = _interopRequireDefault(_iso);

var _disputedBorders = require('./disputedBorders');

var _disputedBorders2 = _interopRequireDefault(_disputedBorders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_DISPUTE = 'en';

var changeDispute = function changeDispute(newValue) {
    return DEFAULT_DISPUTE = newValue;
};
var lastDisputedData = {};

var getDataSet = function getDataSet() {
    var dispute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_DISPUTE;

    if (lastDisputedData.dispute === dispute) {
        return lastDisputedData.data;
    }
    lastDisputedData = {
        dispute: dispute,
        data: (0, _disputedBorders2.default)(_iso2.default, dispute)
    };
    return lastDisputedData.data;
};

var getFlatData = function getFlatData() {
    var dispute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_DISPUTE;

    var list = getDataSet(dispute);
    var result = [];
    Object.keys(list).forEach(function (key) {
        result.push(list[key]);
    });
    return result;
};

var getRegionsFor = function getRegionsFor(countryIsoCode) {
    var dataSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var country = (dataSet || getDataSet())[countryIsoCode];
    if (country) {
        return country.regions;
    }
    return [];
};

var findCountryByName = function findCountryByName(name, dispute) {
    var result = getFlatData(dispute).filter(function (country) {
        var names = country.names;
        var found = false;
        Object.keys(names).forEach(function (lng) {
            found |= names[lng] == name;
        });
        return found;
    });
    if (result.length) {
        return result[0];
    }
    return null;
};

var findRegionByCode = function findRegionByCode(code, dispute) {
    var _code$split = code.split('-'),
        _code$split2 = _slicedToArray(_code$split, 2),
        iso1 = _code$split2[0],
        iso2 = _code$split2[1];

    var countries = getDataSet(dispute);
    var country = countries[iso1];

    if (!country) {
        return [];
    }
    return country.regions.filter(function (region) {
        return region.iso === iso2;
    });
};

exports.getDataSet = getDataSet;
exports.getRegionsFor = getRegionsFor;
exports.changeDispute = changeDispute;
exports.findCountryByName = findCountryByName;
exports.findRegionByCode = findRegionByCode;