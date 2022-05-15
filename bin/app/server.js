
const UserHandler = require('../modules/user/handler/handler')
const CommonHandler = require('../modules/common/handler/handler')
const SchoolHandler = require('../modules/school/handler/handler')

const serverHandler = async (fastify, _, done) => {
  await new UserHandler(fastify).server(fastify); 
  await new CommonHandler(fastify).server(fastify)
  await new SchoolHandler(fastify).server(fastify)
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