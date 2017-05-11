'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _disputes = require('./disputes');

var _disputes2 = _interopRequireDefault(_disputes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LookupRegion = function () {
    function LookupRegion(country, region) {
        _classCallCheck(this, LookupRegion);

        this.parent = country.reference.openstreetmap;
        this.osmId = region.reference.openstreetmap;
        this.level = region.reference.openstreetmap_level;
        this.data = region;
    }

    _createClass(LookupRegion, [{
        key: 'hasParent',
        value: function hasParent(parent) {
            return this.parent === parent;
        }
    }]);

    return LookupRegion;
}();

function applyFixture() {
    var dataRecord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fixture = arguments[1];

    if (!fixture) {
        return dataRecord;
    }
    var result = _extends({}, dataRecord);
    for (var i in fixture) {
        if (_typeof(fixture[i]) === 'object') {
            result[i] = applyFixture(dataRecord[i], fixture[i]);
        } else {
            result[i] = fixture[i];
        }
    }
    return result;
}

function filter(data, scheme) {
    var command = _disputes2.default[scheme];
    if (!command) {
        return data;
    }
    var rules = command.rules,
        _command$fixtures = command.fixtures,
        fixtures = _command$fixtures === undefined ? {} : _command$fixtures;
    // unwrap all regions

    var allRegions = [];
    Object.keys(data).forEach(function (key) {
        var country = data[key];
        country.regions.forEach(function (region) {
            allRegions.push(new LookupRegion(country, applyFixture(region, applyFixture(region, fixtures[region.reference.openstreetmap]))));
        });
    });

    // Go thought all countries and regions and recombine them.
    // More information can be found at esosedi/osme project
    var result = {};

    Object.keys(data).forEach(function (key) {
        var dataRecord = data[key];
        var parentId = dataRecord.reference.openstreetmap;
        var filter = rules[parentId];
        var fixture = fixtures[parentId];
        dataRecord = applyFixture(dataRecord, fixture);

        // no filters
        if (!filter) {
            result[key] = dataRecord;
        } else {
            (function () {
                var regions = [];
                allRegions.forEach(function (region) {
                    if (filter(region)) {
                        regions.push(region.data);
                    }
                });

                if (regions.length) {
                    result[key] = Object.assign({}, dataRecord, { regions: regions });
                } else {
                    // drop country
                }
            })();
        }
    });
    return result;
}

exports.default = filter;