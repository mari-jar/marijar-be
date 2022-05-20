
const pg = require('fastify-postgres')

const { env } = require('../../../../config')

module.exports = (fastify) => {
  fastify.register(pg, {
    connectionString: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DATABASE}`,
    // ssl: { rejectUnauthorized: false }
  })
}


