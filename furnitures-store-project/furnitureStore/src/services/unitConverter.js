

function convertToCM(measurementinMM) {
    return measurementinMM / 10;
    
}

function convertToInches(measurementinMM){
    measurementinMM /= 25.4
    let n = measurementinMM.toFixed(2)
    return n

}

function convertToFeet(measurementinMM){
    measurementinMM /= 304.8
    let n = measurementinMM.toFixed(2)
    return n

}

module.exports = {convertToCM, convertToFeet, convertToInches}