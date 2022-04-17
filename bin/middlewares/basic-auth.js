
const httpError = require('http-errors')
const basicAuth = require('fastify-basic-auth')
const config = require('../../config')

module.exports = (fastify) => {
  fastify.register(basicAuth, { validate })
  async function validate (username, password, req, reply) {
    if (username !== config.env.BASIC_AUTH_USERNAME && password !== config.env.BASIC_AUTH_PASSWORD) {
      throw httpError.Unauthorized('Nice Try')
    }
  }
}