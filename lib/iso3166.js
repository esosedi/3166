'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reduce = exports.findRegionByCode = exports.findCountryByName = exports.changeNameProvider = exports.changeDispute = exports.getRegionsFor = exports.getDataSet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _iso = require('../data/iso3166-2.json');

var _iso2 = _interopRequireDefault(_iso);

var _disputedBorders = require('./disputedBorders');

var _disputedBorders2 = _interopRequireDefault(_disputedBorders);

var _nameProvider = require('./nameProvider');

var _nameProvider2 = _interopRequireDefault(_nameProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_DISPUTE = 'en';
var NAMES_SET = 'wikipedia';

var changeDispute = function changeDispute(newValue) {
    return DEFAULT_DISPUTE = newValue;
};
var changeNameProvider = function changeNameProvider(newValue) {
    return NAMES_SET = newValue;
};

var lastDisputedData = {};
var lastDataSet = {};

var getDisputedData = function getDisputedData() {
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

var getDataSet = function getDataSet() {
    var dispute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_DISPUTE;

    if (lastDataSet.dispute === dispute && lastDataSet.names == NAMES_SET) {
        return lastDataSet.data;
    }
    lastDisputedData = {
        dispute: dispute,
        names: NAMES_SET,
        data: (0, _nameProvider2.default)(getDisputedData(_iso2.default, dispute), NAMES_SET)
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

var reduce = function reduce(dataset, lang, countryList) {
    var result = {};
    Object.keys(dataset).forEach(function (iso1) {
        if (countryList && countryList.indexOf(iso1) < 0) {
            return;
        }

        var country = _extends({}, dataset[iso1]);
        country.name = country.names[lang] || country.name;
        delete country.names;
        var regions = country.regions;
        country.regions = [];
        regions.forEach(function (oldRegion) {
            var region = _extends({}, oldRegion);
            region.name = region.names[lang] || region.name;
            delete region.names;
            country.regions.push(region);
        });

        result[iso1] = country;
    });
    return result;
};

exports.getDataSet = getDataSet;
exports.getRegionsFor = getRegionsFor;
exports.changeDispute = changeDispute;
exports.changeNameProvider = changeNameProvider;
exports.findCountryByName = findCountryByName;
exports.findRegionByCode = findRegionByCode;
exports.reduce = reduce;