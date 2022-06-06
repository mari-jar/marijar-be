
const schema = require("../schema/schema");
const Usecase = require("../usecase/usecase");

module.exports = class {
  constructor (fastify) {
    this.usecase = new Usecase(fastify)
  }
  
  async server(fastify) {
    await fastify.post('/employee', { schema: schema.insert, onRequest: fastify.bearerToken }, this.insert);
    await fastify.put('/employee/:id', { schema: schema.update, onRequest: fastify.bearerToken }, this.update);
    await fastify.delete('/employee/:id', { schema: schema.delete, onRequest: fastify.bearerToken }, this.delete);
    await fastify.get('/employee', { schema: schema.list, onRequest: fastify.bearerToken }, this.list);
    await fastify.get('/employee/:id', { schema: schema.detail, onRequest: fastify.bearerToken }, this.detail);
  }
  
  insert = async (request, reply) => {
    const { body:payload } = request
    const opts = await request.user
    const response = await this.usecase.insert(payload, opts)
    
    reply.send(response)
  }

  update = async (request, reply) => {
    const { body, params } = request
    const opts = await request.user
    const response = await this.usecase.update({ ...body, ...params }, opts)
    
    reply.send(response)
  }

  delete = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.delete(payload)
    
    reply.send(response) 
  }

  list = async (request, reply) => {
    const { query:payload } = request
    const response = await this.usecase.list(payload)
    
    reply.send(response)
  }

  detail = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.detail(payload)
    
    reply.send(response)
  }

}
