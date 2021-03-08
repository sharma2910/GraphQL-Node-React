/**
 * Converts date in milli second format to ISO format
 * @param {String} date 
 */
function dateToString(date){
    return new Date(date).toISOString();
}

module.exports = {
    dateToString
}