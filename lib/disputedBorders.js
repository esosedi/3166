"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-unused-vars */
var disputedBorders = {
    ru: {
        60199: function _(region) {
            return region.hasParent(60199) && region.osmId != 72639 && region.osmId != 1574364 && region.osmId != 421866;
        }, //UA

        60189: function _(region) {
            return region.hasParent(60189) || region.osmId == 60189 || region.osmId == 72639;
        }, //RU w/o SEV
        28699: function _(region) {
            return region.hasParent(28699);
        }, //UA
        270056: function _(region) {
            return region.hasParent(270056) || region.osmId == 449220;
        }, //move TW to CN
        449220: function _(region) {
            return false;
        }, //drop TW
        192691: function _(region) {
            return region.hasParent(192691) || region.osmId == 195838;
        }, //move EH to MA
        195838: function _(region) {
            return false;
        }, //drop EH

        2514541: function _(region) {
            return false;
        }, //drop Cirpus
        3263728: function _(region) {
            return false;
        }, //drop Cirpus
        3263726: function _(region) {
            return false;
        }, //drop Cirpus

        2088990: function _(region) {
            return false;
        } //drop Serbia
    },
    ua: {
        2514541: function _(region) {
            return false;
        }, //drop Cirpus
        3263728: function _(region) {
            return false;
        }, //drop Cirpus
        3263726: function _(region) {
            return false;
        }, //drop Cirpus

        2088990: function _(region) {
            return false;
        }, //drop Serbia

        192691: function _(region) {
            return region.hasParent(192691) || region.osmId == 195838;
        }, //move EH to MA
        195838: function _(region) {
            return false;
        }, //drop EH

        1152720: function _(region) {
            return false;
        }, //drop Ab
        1152717: function _(region) {
            return false;
        }, //drop Oset

        270056: function _(region) {
            return region.hasParent(270056) || region.osmId == 449220;
        }, //move TW to CN
        449220: function _(region) {
            return false;
        } },
    en: {
        2514541: function _(region) {
            return false;
        }, //drop Cirpus
        3263728: function _(region) {
            return false;
        }, //drop Cirpus
        3263726: function _(region) {
            return false;
        }, //drop Cirpus

        1152720: function _(region) {
            return false;
        }, //drop Ab
        1152717: function _(region) {
            return false;
        }, //drop Oset

        1741311: function _(region) {
            return region.hasParent(1741311) && region.level == 6;
        } },
    tr: {
        307787: function _(region) {
            return false;
        }, //drop BIG Cirpus
        1741311: function _(region) {
            return region.hasParent(1741311) && region.level == 6;
        }, //RS w/o RS-KM

        1152720: function _(region) {
            return false;
        }, //drop Ab
        1152717: function _(region) {
            return false;
        }, //drop Oset

        192691: function _(region) {
            return region.hasParent(192691) || region.osmId == 195838;
        }, //move EH to MA
        195838: function _(region) {
            return false;
        }, //drop EH

        270056: function _(region) {
            return region.hasParent(270056) || region.osmId == 449220;
        }, //move TW to CN
        449220: function _(region) {
            return false;
        } }
};

var LookupRegion = function () {
    function LookupRegion(country, region) {
        _classCallCheck(this, LookupRegion);

        this.parent = country.reference.openstreetmap;
        this.osmId = region.reference.openstreetmap;
        this.level = region.reference.openstreetmap_level;
        this.data = region;
    }

    _createClass(LookupRegion, [{
        key: "hasParent",
        value: function hasParent(parent) {
            return this.parent === parent;
        }
    }]);

    return LookupRegion;
}();

function filter(data, scheme) {
    var command = disputedBorders[scheme];
    if (!command) {
        return data;
    }
    // unwrap all regions
    var allRegions = [];
    Object.keys(data).forEach(function (key) {
        var country = data[key];
        country.regions.forEach(function (region) {
            allRegions.push(new LookupRegion(country, region));
        });
    });

    // Go thought all countries and regions and recombine them.
    // More information can be found at esosedi/osme project
    var result = {};
    Object.keys(data).forEach(function (key) {
        var country = data[key];
        var parentId = country.reference.openstreetmap;
        var filter = command[parentId];
        // no filters
        if (!filter) {
            result[key] = country;
        } else {
            (function () {
                var regions = [];
                allRegions.forEach(function (region) {
                    if (filter(region)) {
                        regions.push(region.data);
                    }
                });

                if (regions.length) {
                    result[key] = Object.assign({}, country, { regions: regions });
                } else {
                    // drop country
                }
            })();
        }
    });
    return result;
}

exports.default = filter;