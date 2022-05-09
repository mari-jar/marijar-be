
const Common = require("../../../repositories/common/pg");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify
    this.common = new Common(fastify)
  }

  async generateRefreshToken(subject, id) {
    let result = id
    const key = `refresh-token-${id}`
    const data = JSON.stringify({sub: subject})
    const expiredIn = 1000 * 60 * 60 * 24 * 30;
    await this.fastify.redis.set(key, data, `EX`, expiredIn)
    return result
  }

}