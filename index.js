const server = require('./bin/app/server');
const db = require('./bin/helpers/db');
const middleware = require('./bin/middlewares');
const config = require('./config');
const qs = require('fastify-qs');
const common = require('./bin/helpers/commons/service');

const fastify = require('fastify')(config.fastify);

fastify.register(qs, {})

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["POST", "PUT", "DELETE", "GET"],
  maxAge: 5,
  allowedHeaders: ["origin", "content-type", "accept", "Authorization"],
  exposedHeaders: ["Authorization"]
});

db.init(fastify);
middleware.init(fastify);
server.init(fastify);
common.init(fastify);

fastify.listen(config.env.PORT, config.env.HOST, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})