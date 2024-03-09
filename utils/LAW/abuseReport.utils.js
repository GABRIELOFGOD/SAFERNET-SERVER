const { lawReportGetter } = require("./abuseDBRelator")

// ================ CASE ID CREATOR =============== //
const gettingReportLength = async () => {
    let render = 0
    const realtor = await lawReportGetter()
    render = realtor.length+1
    return render
}

const caseCodeCreator = (type) => {
    let upperCaseLetters = 'ABCDEFGHIJKLMNOTUVWXYZ'
    let lowerCaseLetters = 'abcdefghijklmnotuvwxyz'
    let userNumbers = '0123456789'
    let allTogether = 'ABCDEFGHIJKLMNOTUVWXYZabcdefghijklmnotuvwxyz0123456789'

    let theCode = ''
    let firstBatch = ''
    let secondBatch = ''

    // for(let i; i < 7; i++){
    //     let randSelect = Math.floor(Math.random()*allTogether.length)
    //     firstBatch += randSelect
    // }

    // for(let i; i < 5; i++){
    //     let randSelect = Math.floor(Math.random()*allTogether.length)
    //     secondBatch += randSelect
    // }

    theCode = `${firstBatch}-${type}-${secondBatch}`
    return theCode

}

function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) { 
        newString += str[i];
    }
    return newString;
}

module.exports = { gettingReportLength, caseCodeCreator, reverseString }
