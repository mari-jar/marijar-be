
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
        break;
      }
      result = operator[key](payload[key])
    }
    return result
  },

  update: (payload) => {
    let i = 0
    let result = ''
    for (const key in payload) {
      result += `${key} = '${payload[key]}'`
      if (Object.keys(payload).length - 1 > i) {
        result += `, `
      }
      i++
    }
    return result
  }
    
}

const operator = {
  /**
   * @To or condition
   * @param {Array} param 
   * @returns {String}
   */
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
  }, 
  /**
   * @To regex
   * @param {Object} param 
   * @returns {String}
   */
  '$regex': (param) => {
    const key = Object.keys(param).shift()
    return `${key} LIKE ${param[key]}`
  }
}

const operatorDefault = (payload) => {
  let i = 0;
  let result = ''
  for (const key in payload) {
    if (validate.isObject(payload[key])) {
      for (const subKey in payload[key]) {
        if (subKey === '$regex') {
          result += `${key} LIKE '${payload[key][subKey]}'`
        }
      }
    } else {
      result += `${key} = '${payload[key]}'`
    }
    if (Object.keys(payload).length - 1 > i) {
      result += ` AND `
    }
    i++
  }
  return result
}
