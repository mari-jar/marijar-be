
const validate = require("validate.js")
const service = require("./service")

module.exports = class {
  constructor (table) {
    this.table = table
  }
 
  insert(payload) {
    const key = Object.keys(payload).join(', ')
    const value = Object.values(payload).map(elm => `'${elm}'`).join(', ')
  
    return  `INSERT INTO ${this.table}(${key}) VALUES(${value}) RETURNING id`
  }

  find(select, where) {
    select = validate.isEmpty(select) ? `*` : select.join(`, `)
    return  `SELECT ${select} FROM ${this.table} WHERE ${service.where(where)}`
  }
}


