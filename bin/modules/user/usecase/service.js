
const Common = require("../../../repositories/common/pg");
const { COMMON_TYPE } = require("../../../helpers/commons");
const { camelCase } = require("change-case");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify
    this.common = new Common(fastify)
  }

  async getUserRole() {
    let result = {}
    const common = await this.common.findMany(['data'], { type: COMMON_TYPE.USER_ROLE })
    common.forEach(elm => {
      result[elm.data.name] = elm.data.disguise
    });
    return result
  }

  async getUserStatus() {
    let result = {}
    const common = await this.common.findMany(['data'], { type: COMMON_TYPE.USER_STATUS })
    common.forEach(elm => {
      const key = camelCase(elm.data.name)
      result[key] = elm.data.name
    });
    return result
  }

  async generateRefreshToken(audience, id) {
    let result = id
    const key = `refresh-token-${id}`
    const data = JSON.stringify({aud: audience})
    const expiredIn = 1000 * 60 * 60 * 24 * 30;
    await this.fastify.redis.set(key, data, `EX`, expiredIn)
    return result
  }

}