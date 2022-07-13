const { send } = require("../../../helpers/utils/wrapper");

const Zone = require("../../../repositories/zone/pg");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify
    
    this.zone = new Zone(fastify)
  }

  async getProvince() {
    const result = await this.zone.findManyCommon('province', {})

    return send(result)
  }

  async getZone(payload, _) {
    const { zone, id } = payload
    const result = await this.zone.findManyCommon(zone, { id: { $regex: `${id}%` } })
    
    return send(result)
  }
}