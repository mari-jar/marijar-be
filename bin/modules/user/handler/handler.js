
const schema = require("../schema/schema");
const Usecase = require("../usecase/usecase");

module.exports = class {
  constructor (fastify) {
    this.usecase = new Usecase(fastify)
  }
  
  async server(fastify) {
    await fastify.post('/user/login', { schema: schema.login, onRequest: fastify.basicAuth }, this.login);
    await fastify.post('/user/refresh-token', { schema: schema.refreshToken, onRequest: fastify.basicAuth }, this.refreshToken);
    await fastify.post('/user', { schema: schema.register, onRequest: fastify.basicAuth }, this.register);
    await fastify.post('/user/verify/send', { schema: schema.sendVerify, onRequest: fastify.basicAuth }, this.sendVerify);
    await fastify.post('/user/verify', { schema: schema.verify, onRequest: fastify.basicAuth }, this.verify);
    await fastify.post('/user/logout', { schema: schema.logout, onRequest: fastify.bearerToken }, this.logout);
    await fastify.get('/user/profile', { schema: schema.getProfile, onRequest: fastify.bearerToken }, this.getProfile);
    await fastify.get('/user/:id', { schema: schema.getDetail, onRequest: fastify.bearerToken }, this.getDetail);
  }
  
  login = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.login(payload)
    
    reply.send(response)
  }
  
  refreshToken = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.refreshToken(payload)
    
    reply.send(response)
  }
  
  register = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.register(payload)
  
    reply.send(response)
  }

  sendVerify = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.sendVerify(payload)
    
    reply.send(response)
  }
  
  verify = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.verify(payload)
  
    reply.send(response)
  }

  logout = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.logout(payload)
  
    reply.send(response)
  }
  
  getDetail = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.getDetail(payload)

    reply.send(response)
  }

  getProfile = async (request, reply) => {
    const opts = await request.user
    const response = await this.usecase.getProfile({}, opts)

    reply.send(response)
  }
}
