
const httpError = require('http-errors');
const validate = require('validate.js');
const Query = require('../../helpers/db/pg/query');
const convert = require('../../helpers/utils/convert');
const validateData = require('../../helpers/utils/validate');
const model = require('./model/model');

const table = "users";

module.exports = class {

  constructor (fastify) {
    this.query = new Query(table);
    this.fastify = fastify
    this.db = fastify.pg
  }
  
  // ================================
  // #Commands
  // ================================
  /**
   * To insert data
   * 
   * @param {Object} payload 
   * @returns {Object} id
   */
  async insert (payload) {
    let result 
    try {
      await validateData(model.insertReq, payload)
      await convert.convertObject('snakeCase', payload)

      const query = this.query.insert(payload)
      const { rows } = await this.db.query(query)
      result = rows.shift()

      await validateData(model.insertRes, result)
      
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }


  // ================================
  // #Commands
  // ================================
  /**
   * To find one
   * 
   * @param {Array} select 
   * @param {Object} where 
   * @returns {Object} (Any)
   */
  async findOne (select, where) {
    let result 

    try {
      await convert.convertArray('snakeCase', select)
      await convert.convertObject('snakeCase', where)

      const query = `${this.query.find(select, where)} LIMIT 1`
      const { rows } = await this.db.query(query)
      result = rows.shift()
      
      if (!validate.isEmpty(result)) {
        await validateData(model.findOneRes, result)
        await convert.convertObject('camelCase', result)
      }
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }

  async findMany (select, filter) {
    return 'haha';
  }
}
