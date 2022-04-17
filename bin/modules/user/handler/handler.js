
const { verifyToken } = require("../../../middlewares/jwt");
const schema = require("../schema/schema");
const Usecase = require("../usecase/usecase");

module.exports = class {
  constructor (fastify) {
    this.usecase = new Usecase(fastify)
  }
  
  async server(fastify) {
    await fastify.post('/user/login', { schema: schema.login, onRequest: fastify.basicAuth }, this.login);
    await fastify.post('/user', { schema: schema.register, onRequest: fastify.basicAuth }, this.register);
    await fastify.get('/user/:id', {  onRequest: fastify.bearerToken }, this.getUser);
  }
  
  login = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.login(payload)
    
    reply.send(response)
  }
  
  register = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.register(payload)
  
    reply.send(response)
  }
  
  getUser = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.getUser(payload)

    reply.send(response)
  }
}
