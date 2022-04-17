
const basicAuth = require("./basic-auth")
const jwt = require("./jwt")

module.exports = {
  init: (fastify) => {
    basicAuth(fastify)
    jwt.init(fastify)
  }
}