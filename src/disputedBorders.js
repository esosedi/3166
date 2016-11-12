const disputedBorders = {
    ru: {
        60199: region=>region.hasParent(60199) && region.osmId != 72639 && region.osmId != 1574364 && region.osmId != 421866, //UA

        60189: (region) => (region.hasParent(60189) || (region.osmId == 60189 || region.osmId == 72639)),//RU w/o SEV
        28699: (region) => (region.hasParent(28699)),  //UA
        270056: (region) => (region.hasParent(270056) || region.osmId == 449220), //move TW to CN
        449220: (region) => false, //drop TW
        192691: (region) => region.hasParent(192691) || region.osmId == 195838, //move EH to MA
        195838: (region) => false, //drop EH

        2514541: (region) => false, //drop Cirpus
        3263728: (region) => false, //drop Cirpus
        3263726: (region) => false, //drop Cirpus

        2088990: (region) => false //drop Serbia
    },
    ua: {
        2514541: (region) => false, //drop Cirpus
        3263728: (region) => false, //drop Cirpus
        3263726: (region) => false, //drop Cirpus

        2088990: (region) => false,//drop Serbia

        192691: (region) => region.hasParent(192691) || region.osmId == 195838, //move EH to MA
        195838: (region) => false, //drop EH

        1152720: (region) => false,//drop Ab
        1152717: (region) => false,//drop Oset

        270056: (region) => region.hasParent(270056) || region.osmId == 449220, //move TW to CN
        449220: (region) => false, //drop TW
    },
    en: {
        2514541: (region) => false, //drop Cirpus
        3263728: (region) => false, //drop Cirpus
        3263726: (region) => false, //drop Cirpus

        1152720: (region) => false,//drop Ab
        1152717: (region) => false,//drop Oset

        1741311: (region) => region.hasParent(1741311) && region.level == 6,//RS w/o RS-KM
    },
    tr: {
        307787: (region) => false, //drop BIG Cirpus
        1741311: (region) => region.hasParent(1741311) && region.level == 6,//RS w/o RS-KM

        1152720: (region) => false,//drop Ab
        1152717: (region) => false,//drop Oset

        192691: (region) => region.hasParent(192691) || region.osmId == 195838, //move EH to MA
        195838: (region) => false, //drop EH

        270056: (region) => region.hasParent(270056) || region.osmId == 449220, //move TW to CN
        449220: (region) => false, //drop TW
    }
};

class LookupRegion {
    constructor(country, region) {
        this.parent = country.reference.openstreetmap;
        this.osmId = region.reference.openstreetmap;
        this.level = region.reference.openstreetmap_level;
        this.data = region;
    }

    hasParent(parent) {
        return this.parent === parent;
    }
}

function filter(data, scheme) {
    const command = disputedBorders[scheme];
    if (!command) {
        return data;
    }
    // unwrap all regions
    const allRegions = [];
    Object.keys(data).forEach(key => {
        const country = data[key];
        country.regions.forEach(region => {
            allRegions.push(new LookupRegion(country, region));
        })
    });

    // Go thought all countries and regions and recombine them.
    // More information can be found at esosedi/osme project
    let result = {};
    Object.keys(data).forEach(key => {
        const country = data[key];
        const parentId = country.reference.openstreetmap;
        const filter = command[parentId];
        // no filters
        if (!filter) {
            result[key] = country;
        } else {
            let regions = [];
            allRegions.forEach(region=> {
                if (filter(region)) {
                    regions.push(region.data);
                }
            });

            if (regions.length) {
                result[key] = Object.assign({}, country, {regions: regions});
            } else {
                // drop country
            }
        }
    });
    return result;
}

export default filter;