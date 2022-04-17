
const userHandler = require('../modules/user/handler/handler')

const serverHandler = async (fastify, _, done) => {
  await new userHandler(fastify).server(fastify); 
  done();
}

module.exports = {
  init: (fastify) => {
    // Check Endpoint
    fastify.get('/', async (request, reply) => {
      return { hello: 'world' }
    })

    // Group Endpoint
    fastify.register(serverHandler, { prefix: '/api/v1' }) 
  }

}