
module.exports = {
  async generateRefreshToken(fastify, subject, id) {
    const key = `refresh-token-${id}`
    const data = JSON.stringify({sub: subject})
    const expiredIn = 1000 * 60 * 60 * 24 * 30;
    await fastify.redis.del(key)
    await fastify.redis.set(key, data, `EX`, expiredIn)
    return id
  },

  async generateUserData(fastify, user, id) {
    delete user.password
    const key = `user-data-${id}`
    const data = JSON.stringify(user)
    const expiredIn = 1000 * 60 * 60 * 1;
    await fastify.redis.set(key, data, `EX`, expiredIn)
    return id
  }

}