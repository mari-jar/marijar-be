
const validate = require("validate.js")
const service = require("./service")

module.exports = class {
  constructor (table) {
    this.table = table
  }
 
  insert(payload) {
    let key = ``, value = ``;
    if (validate.isArray(payload)) {
      payload.forEach((payloadElm, idx) => {
        key = Object.keys(payloadElm).join(', ')
        value += `(${Object.values(payloadElm).map(elm => `'${elm}'`).join(', ')})`
        if (idx != payload.length - 1) {
          value += `, `
        }
      })
    } else {
      key = Object.keys(payload).join(', ')
      value = `(${Object.values(payload).map(elm => `'${elm}'`).join(', ')})`
    }
  
    return  `INSERT INTO ${this.table}(${key}) VALUES ${value} RETURNING id`
  }

  update(where, payload) {
    return  `UPDATE ${this.table} SET ${service.update(payload)} WHERE ${service.where(where)}`
  }

  delete(where) {
    return `DELETE FROM ${this.table} WHERE ${service.where(where)}`
  }

  find(select, where) {
    select = validate.isEmpty(select) ? `*` : select.join(`, `)
    let result = `SELECT ${select} FROM ${this.table}`
    if (!validate.isEmpty(where)) {
      result += ` WHERE ${service.where(where)}`
    }
    return  result
  }

  count(where) {
    let result = `SELECT COUNT(1) FROM ${this.table}`
    if (!validate.isEmpty(where)) {
      result += ` WHERE ${service.where(where)}`
    }
    return result
  }
}


