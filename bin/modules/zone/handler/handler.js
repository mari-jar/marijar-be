
const schema = require("../schema/schema");
const Usecase = require("../usecase/usecase");

module.exports = class {
  constructor (fastify) {
    this.usecase = new Usecase(fastify)
  }
  
  async server(fastify) {
    await fastify.get('/zone/province', { schema: schema.getProvince, onRequest: fastify.bearerToken }, this.getProvince);
    await fastify.get('/zone/:zone/:id', { schema: schema.getZone, onRequest: fastify.bearerToken }, this.getZone);
  }
    
  getProvince = async (_, reply) => {
    const response = await this.usecase.getProvince()

    reply.send(response)
  }

  getZone = async (request, reply) => {
    const { params:payload } = request
    const response = await this.usecase.getZone(payload)

    reply.send(response)
  }

  // getProfile = async (request, reply) => {
  //   const opts = await request.user
  //   const response = await this.usecase.getProfile({}, opts)

  //   reply.send(response)
  // }
}
