const { send } = require("../../../helpers/utils/wrapper");
const { v4: uuid } = require('uuid');
const validateData = require('../../../helpers/utils/validate');
const schema = require("../schema/schema");
const validate = require("validate.js");
const httpError = require("http-errors");
const Common = require("../../../repositories/common/pg");

module.exports = class {
  constructor (fastify) {
    this.common = new Common(fastify)
  }

  async insert(payload) {
    let result
    const dataStr = JSON.stringify(payload.data)
    const insertData = {
      ...payload,
      id: uuid(),
      data: dataStr
    }
    result =  await this.common.insert(insertData)

    return send(result)
  }

  async update(payload) {
    let result
    const { id, type } = payload

    const common = await this.common.findOne(['data'], { id, type })
    if (validate.isEmpty(common)) {
      throw httpError.NotFound('data tidak ditemukan')
    }

    const model = {
      userRole: schema.userRole
    }
    const data = {
      ...common.data,
      ...payload.data
    }
    await validateData(model[type], data)
    const dataStr = JSON.stringify(data)

    const insertData = {
      type: type,
      data: dataStr
    }
    await this.common.update({ id, type }, insertData)
    result = { id }
    return send(result)
  }

  async delete(payload) {
    let result
    const { id } = payload

    result = await this.common.delete({ id })

    return send(result)
  }

  async listByType(payload) {
    let result
    const { type } = payload

    result = await this.common.findMany(['id', 'data'], { type })
    if (!validate.isEmpty(result)) {
      result = result.map(elm => {
        const {id, data} = elm
        return { id, ...data }
      })
    }
    
    return send(result)
  }
}