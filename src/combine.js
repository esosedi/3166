import {setDataFile} from './IoT';

const combine = (countryList, regions = {}) => {

    const result = {...countryList};

    Object.keys(regions).forEach(iso1 => {
        result[iso1].regions = regions[iso1];
    });

    return result;
};

const use = (dataset) => setDataFile(dataset);

export {
    combine,
    use
};