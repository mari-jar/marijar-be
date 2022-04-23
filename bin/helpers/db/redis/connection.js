const redis = require('fastify-redis')

const { env } = require('../../../../config')

module.exports = (fastify) => {
  fastify.register(redis, {
    host: env.REDIS_HOST, 
    password: env.REDIS_PASSWORD,
    port: env.REDIS_PORT,
    family: env.REDIS_FAMILY 
  })
}