
const pg = require("./pg/connection")
const redis = require("./redis/connection")

module.exports = { 
  init: (fastify) => {
    pg(fastify)
    redis(fastify)
  }
}
