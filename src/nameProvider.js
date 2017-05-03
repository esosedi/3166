import geonames from '../data/names_geonames.json';
import osm from '../data/names_osm.json';
import {setNameProvider} from './IoT';

const traverse = (data, keyfn, source) => {
    let result = {};
    Object.keys(data).forEach(iso1=> {
        let country = {
            ...data[iso1]
        };
        const key = keyfn(country.reference);
        if (source[key]) {
            country.names = {
                ...country.names,
                ...source[key]
            };
        }
        const regions = country.regions;
        country.regions = [];
        regions.forEach(oldRegion=> {
            let region = {
                ...oldRegion
            };
            const key = keyfn(region.reference);
            if (source[key]) {
                region.names = {
                    ...region.names,
                    ...source[key]
                };
            }
            country.regions.push(region);
        });

        result[iso1] = country;
    });
    return result;
};

const patchGeonames = (dataset) => traverse(
    dataset,
    (record) => record.geonames,
    geonames
);

const patchOsm = (dataset) => traverse(
    dataset,
    (record) => record.openstreetmap,
    osm
);

const patch = (dataset, provider = 'wikipedia')=> {
    if (provider == 'geonames') {
        return patchGeonames(dataset);
    }
    if (provider == 'geonames') {
        return patchOsm(dataset);
    }
    return dataset;
};


setNameProvider(patch);

export default patch;