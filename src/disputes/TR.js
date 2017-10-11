/* eslint-disable no-unused-vars */

export default {
    rules: {
        307787: (region) => false, //drop BIG Cirpus
        1741311: (region) => region.hasParent(1741311) && region.level == 4,//RS w/o RS-KM

        1152720: (region) => false,//drop Ab
        1152717: (region) => false,//drop Oset

        192691: (region) => region.hasParent(192691) || region.osmId == 195838, //move EH to MA
        195838: (region) => false, //drop EH

        270056: (region) => region.hasParent(270056) || region.osmId == 449220, //move TW to CN
        449220: (region) => false, //drop TW
    }
};