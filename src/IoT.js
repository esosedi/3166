let nameProvider = null;
let dataFile = null;

const setNameProvider = (np) => nameProvider = np;
const getNameProvider = () => nameProvider;

const setDataFile = (df) => dataFile = df;
const getDataFile = () => dataFile;

export {
    setNameProvider,
    getNameProvider,

    setDataFile,
    getDataFile
}