const server = require('./bin/app/server');
const db = require('./bin/helpers/db');
const middleware = require('./bin/middlewares');
const config = require('./config');
const qs = require('fastify-qs')

const fastify = require('fastify')(config.fastify);

fastify.register(qs, {})

db.init(fastify);
middleware.init(fastify)
server.init(fastify);

fastify.listen(config.env.APP_PORT, config.env.APP_HOST, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})