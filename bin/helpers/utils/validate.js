
const { default: Ajv } = require("ajv")

/**
 * To validate general object
 * 
 * @param {Object} schema 
 * @param {Object} data 
 */
module.exports = async (schema, data) => {
  const ajv = new Ajv({allErrors: true}) 
  
  const validate = await ajv.compile(schema)
  const valid = validate(data)
  if (!valid) { 
    const err = ajv.errorsText(validate.errors)
    throw new Error(err)
  }
}