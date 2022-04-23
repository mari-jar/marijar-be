
const schema = require("../schema/schema");
const Usecase = require("../usecase/usecase");

module.exports = class {
  constructor (fastify) {
    this.usecase = new Usecase(fastify)
  }
  
  async server(fastify) {
    await fastify.post('/common', { schema: schema.insert, onRequest: fastify.basicAuth }, this.insert);
    await fastify.put('/common/:type/:id', { schema: schema.update, onRequest: fastify.basicAuth }, this.update);
    await fastify.delete('/common/:id', { schema: schema.delete, onRequest: fastify.basicAuth }, this.delete);
    await fastify.get('/common/:type', { schema: schema.listByType, onRequest: fastify.basicAuth }, this.listByType);
  }
  
  insert = async (request, reply) => {
    const { body:payload } = request
    const response = await this.usecase.insert(payload)
    
    reply.send(response)
  }
  
  update = async (request, reply) => {
    const { body, params } = request
    const response = await this.usecase.update({...body, ...params})
  
    reply.send(response)
  }
  
  delete = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.delete(payload)

    reply.send(response)
  }

  listByType = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.listByType(payload)

    reply.send(response)
  }
}
