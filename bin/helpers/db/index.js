
const pg = require("./pg/connection")

module.exports = { 
  init: (fastify) => {
    pg(fastify)
  }
}
