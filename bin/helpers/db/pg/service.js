
const validate = require("validate.js")

module.exports = {
  /**
   * 
   * @param {Object} payload 
   * @returns String
   */
  where: (payload) => {
    let result = ''
    for(const key in payload) {
      if (validate.isEmpty(operator[key])) {
        result += `(${operatorDefault(payload)})`
        continue;
      }
      result = operator[key](payload[key])
    }
    return result
  },
    
}

const operator = {
  '$or': (param) => {
    let result = ``
    param.forEach((elm, idx) => {
      let temp = `(`
      temp += operatorDefault(elm);
      temp += `)`
      if (param.length - 1 > idx) {
        temp += ` OR `
      }
      result += temp  
    });
    return result
  }
}

const operatorDefault = (payload) => {
  let i = 0;
  let result = ''
  for (const key in payload) {
    result += `${key} = '${payload[key]}'`
    if (Object.keys(payload).length - 1 > i) {
      result += ` AND `
    }
    i++
  }
  return result
}
