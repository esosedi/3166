/* eslint-disable no-unused-vars */

export default {
    rules: {
        2514541: (region) => false, //drop Cirpus
        3263728: (region) => false, //drop Cirpus
        3263726: (region) => false, //drop Cirpus

        1152720: (region) => false,//drop Ab
        1152717: (region) => false,//drop Oset

        1741311: (region) => region.hasParent(1741311) && region.level == 6,//RS w/o RS-KM
    }
}