
module.exports = {
  async generateRefreshToken(fastify, userId, id) {
    const key = `refresh-token-${id}`
    const data = JSON.stringify({ userId })
    const expiredIn = 1000 * 60 * 60 * 24 * 7;
    await fastify.redis.set(key, data, `EX`, expiredIn)
    return id
  },

  async generateUserData(fastify, user, id) {
    delete user.password
    user.sub = id
    const key = `user-data-${id}`
    const data = JSON.stringify(user)
    const expiredIn = 1000 * 60 * 60 * 24 * 1;
    await fastify.redis.set(key, data, `EX`, expiredIn)
    return id
  }

}