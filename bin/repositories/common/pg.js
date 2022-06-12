
const httpError = require('http-errors');
const validate = require('validate.js');
const Query = require('../../helpers/db/pg/query');
const convert = require('../../helpers/utils/convert');
const validateData = require('../../helpers/utils/validate');
const model = require('./model/model');

const table = "commons";

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
      
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }

  /**
   * To update data
   * 
   * @param {Object} payload 
   * @param {Object} where
   */
   async update (where, payload) {
    let result 
    try {
      await validateData(model.updateReq, payload)
      await convert.convertObject('snakeCase', payload)
      await convert.convertObject('snakeCase', where)

      const query = this.query.update(where, payload)
      const { rows } = await this.db.query(query)
      result = rows.shift()
      
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }

  /**
   * To insert data
   * 
   * @param {Object} where
   */
   async delete (where) {
    let result 
    try {
      await convert.convertObject('snakeCase', where)

      const query = this.query.delete(where)
      const { rows } = await this.db.query(query)
      result = rows.shift()
      
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }


  // ================================
  // #Queries
  // ================================
  /**
   * To find one
   * 
   * @param {Array} select 
   * @param {Object} where 
   * @returns {Object} Any
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

  /**
   * To find one
   * 
   * @param {Array} select 
   * @param {Object} where 
   * @returns {Array} Any
   */
   async findMany (select, where) {
    let result 

    try {
      await convert.convertArray('snakeCase', select)
      await convert.convertObject('snakeCase', where)

      const query = `${this.query.find(select, where)}`
      const { rows } = await this.db.query(query)
      result = rows
      
      if (!validate.isEmpty(result)) {
        await validateData(model.findManyRes, result)
        await convert.convertObject('camelCase', result)
      }
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }

  /**
   * To find many with group specific column
   * 
   * @param {Array} select 
   * @param {Object} where 
   * @param {String} group
   * @returns {Array} Any
   */
  async findManyGroup (select, where, group) {
    let result 

    try {
      await convert.convertArray('snakeCase', select)
      await convert.convertObject('snakeCase', where)

      const query = `${this.query.find(select, where)} GROUP BY ${group}`
      const { rows } = await this.db.query(query)
      result = rows
      
      if (!validate.isEmpty(result)) {
        await validateData(model.findManyRes, result)
        await convert.convertObject('camelCase', result)
      }
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }
}
