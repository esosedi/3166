/* eslint-disable no-unused-vars */

export default {
    rules: {
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
    fixtures: {
        72639: {
            name: "Crimea",
            names: {
                "geonames": "Krym",
                "ru": "Крым",
                "en": "Crimea",
                "ar": "القرم",
                "de": "Krim",
                "es": "Crimea",
                "fr": "Crimée",
                "it": "Crimea",
                "zh": "克里米亞共和國"
            },
            iso: "CR",
            fips: null,
            reference: {
                geonames: 703883,
                openstreetmap: 72639,
                openstreetmap_level: 4,
                wikipedia: "en:Republic_of_Crimea",
                wof: null
            }
        },
        1574364: {
            "name": "Sevastopol",
            "iso": "SV",
            "fips": null
        }
    }
};
