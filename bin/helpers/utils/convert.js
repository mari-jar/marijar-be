const { snakeCase, camelCase } = require("change-case");
const validate = require("validate.js");

const caseStyles = {
  snakeCase: async (param) => snakeCase(param),
  camelCase: async (param) => camelCase(param)
}

/**
   * To convert case style object keys
   * 
   * @param {String} caseString 
   * @param {Object} payload 
   */
const convertObject = async (caseString, payload) => {
  const format = /[$]/;
  const cs = caseStyles[caseString]

  for (const key in payload) {
    const keyNew = await cs(key)
    if (key !== keyNew && !format.test(key)) {
      await converter(payload, key, keyNew)
    } 
    
    const data = payload[key] || payload[keyNew]
    if (validate.isArray(data)) {
      await mappingArray(caseString, data)
    }
    else if (validate.isObject(data)) {
      await convertObject(caseString, data)
    }
  }
}

/**
 * 
 * @param {String} caseString 
 * @param {Array} payload 
 * @returns Array
 */
const convertArray = async (caseString, payload) => {
  for ( const key in payload ) {
    payload[key] = await caseStyles[caseString](payload[key])
  }
}

const mappingArray = async (caseString, payload) => {
  for ( const key in payload ) {
    await convertObject(caseString, payload[key])
  }
}

const converter = async (object, key, keyNew) => {
  await Object.defineProperty(object, keyNew, Object.getOwnPropertyDescriptor(object, key));
  delete object[key];
}

module.exports = {
  convertObject,
  convertArray
}