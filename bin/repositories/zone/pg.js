
const httpError = require('http-errors');
const validate = require('validate.js');
const Query = require('../../helpers/db/pg/query');
const validateData = require('../../helpers/utils/validate');
const model = require('./model/model');

const table = "zones";

module.exports = class {

  constructor (fastify) {
    this.query = new Query(table);
    this.fastify = fastify
    this.db = fastify.pg
  }

  // ================================
  // #Queries
  // ================================
  /**
   * @To find many
   * 
   * @param {String} zone
   * @param {Object} where
   * @return {Array} any
   */
  async findManyCommon(zone, where) {
    let result

    try {
      await validateData(model.findManyCommonReq, { zone, where })

      const idLen = {
        province: 2,
        district: 5,
        subdistrict: 8,
        village: 13
      }
      where['length(id)'] = idLen[zone]

      const query = this.query.find([], where)
      const { rows } = await this.db.query(query)
      result = rows
      
      if (!validate.isEmpty(result)) {
        await validateData(model.findManyCommonRes, result)
      }
    } catch (error) {
      throw httpError.InternalServerError(error);
    }

    return result
  }

}
