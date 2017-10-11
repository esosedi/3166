/* eslint-disable no-unused-vars */

export default {
    rules: {
        2514541: (region) => false, //drop Cirpus
        3263728: (region) => false, //drop Cirpus
        3263726: (region) => false, //drop Cirpus

        2088990: (region) => false,//drop Kosovo

        192691: (region) => region.hasParent(192691) || region.osmId == 195838, //move EH to MA
        195838: (region) => false, //drop EH

        1152720: (region) => false,//drop Ab
        1152717: (region) => false,//drop Oset

        270056: (region) => region.hasParent(270056) || region.osmId == 449220, //move TW to CN
        449220: (region) => false, //drop TW
    }
};