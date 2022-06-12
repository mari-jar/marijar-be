
const httpError = require('http-errors');
const validate = require('validate.js');
const Query = require('../../helpers/db/pg/query');
const convert = require('../../helpers/utils/convert');
const validateData = require('../../helpers/utils/validate');
const model = require('./model/model');

const table = "employees";

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
      console.log(error)
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
   * To count data
   * 
   * @param {Object} where 
   * @returns {Object} Any
   */
   async count (where) {
    let result 

    try {
      await convert.convertObject('snakeCase', where)

      const query = `${this.query.count(where)}`
      const { rows } = await this.db.query(query)
      result = parseInt(rows.shift().count)

    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }

  /**
   * To find with pagination
   * 
   * @param {Array} select 
   * @param {Object} where 
   * @param {Array} sort 
   * @param {Integer} limit 
   * @param {Integer} offset 
   * @returns {Array} Any
   */
   async pagination (select, where, sort, limit, offset) {
    let result 

    try {
      await convert.convertArray('snakeCase', select)
      await convert.convertObject('snakeCase', where)
      await convert.convertArray('snakeCase', sort)
      
      sort = sort.join(' ');
      const query = `${this.query.find(select, where)} ORDER BY ${sort} LIMIT ${limit} OFFSET ${offset}`
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
