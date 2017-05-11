import disputedBorders from './disputes';

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

function applyFixture(dataRecord = {}, fixture) {
    if (!fixture) {
        return dataRecord;
    }
    const result = {...dataRecord};
    for (const i in fixture) {
        if (typeof fixture[i] === 'object') {
            result[i] = applyFixture(dataRecord[i], fixture[i]);
        } else {
            result[i] = fixture[i];
        }
    }
    return result;
}

function filter(data, scheme) {
    const command = disputedBorders[scheme];
    if (!command) {
        return data;
    }
    const {rules, fixtures = {}} = command;
    // unwrap all regions
    const allRegions = [];
    Object.keys(data).forEach(key => {
        const country = data[key];
        country.regions.forEach(region => {
            allRegions.push(new LookupRegion(
                country,
                applyFixture(region, applyFixture(region, fixtures[region.reference.openstreetmap]))
            ));
        })
    });

    // Go thought all countries and regions and recombine them.
    // More information can be found at esosedi/osme project
    let result = {};

    Object.keys(data).forEach(key => {
        let dataRecord = data[key];
        const parentId = dataRecord.reference.openstreetmap;
        const filter = rules[parentId];
        const fixture = fixtures[parentId];
        dataRecord = applyFixture(dataRecord, fixture);

        // no filters
        if (!filter) {
            result[key] = dataRecord;
        } else {
            let regions = [];
            allRegions.forEach(region=> {
                if (filter(region)) {
                    regions.push(region.data);
                }
            });

            if (regions.length) {
                result[key] = Object.assign({}, dataRecord, {regions: regions});
            } else {
                // drop country
            }
        }
    });
    return result;
}

export default filter;